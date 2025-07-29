const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const db = require("../firebaseService");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let cachedPromo = null;
let lastGenerated = null;
const CACHE_DURATION = 1000 * 30; // 1 hour
const promoCacheByIP = {}; // { ip: { promotion, lastGenerated } }


router.get("/generate-promo", async (req, res) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // fallback if IP is an array (e.g. in 'x-forwarded-for'), take first IP
    const clientIp = Array.isArray(ip) ? ip[0] : ip;

    const now = Date.now();

    if (
        promoCacheByIP[clientIp] &&
        promoCacheByIP[clientIp].lastGenerated &&
        (now - promoCacheByIP[clientIp].lastGenerated < CACHE_DURATION)
    ) {
        return res.json({ promotion: promoCacheByIP[clientIp].promotion });
    }

    if (cachedPromo && lastGenerated && (now - lastGenerated < CACHE_DURATION)) {
        return res.json({ promotion: cachedPromo });
    }

    try {
        const snapshot = await db
            .collection("menuSelections")
            .where("ip", "==", clientIp) // **make sure your documents store user IP!**
            .orderBy("createdAt", "desc")
            .limit(5)
            .get();

        const selections = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            if (Array.isArray(data.items)) {
                selections.push(...data.items.map(item => item.name));
            }
        });

        const prompt = `Write ONLY ONE short, catchy sentence promoting a restaurant special based on the following dishes: ${selections.join(", ")}. Make it sound exciting and include a simple call to action. DONT REPEAT YOURSELF`;

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a creative marketing assistant for a small restaurant.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            max_tokens: 50, // limits the response length
        });

        const aiText = chatResponse.choices[0].message.content;

        // Cache it
        cachedPromo = aiText;
        lastGenerated = now;

        promoCacheByIP[clientIp] = { promotion: aiText, lastGenerated: now };

        res.json({ promotion: aiText });
    } catch (err) {
        console.error("❌ GPT Promo Error:", err);
        res.status(500).json({ error: "Failed to generate promotion" });
    }
});

router.use((req, res, next) => {
    console.log(`🔍 GPT Route Hit: ${req.method} ${req.originalUrl}`);
    next();
});

router.post("/admin-generate-promo", async (req, res) => {
    const { tone = "casual", limit = 5 } = req.body;

    try {
        const snapshot = await db
            .collection("menuSelections")
            .orderBy("createdAt", "desc")
            .limit(limit)
            .get();

        const allItems = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (Array.isArray(data.items)) {
                console.log("🔥 Raw items from Firestore:", data.items);
                allItems.push(...data.items);
            }
        });

        const uniqueNames = [...new Set(allItems.map(i => i.name))];
        console.log("✅ Unique dish names:", uniqueNames);

        if (uniqueNames.length === 0) {
            return res.status(400).json({ error: "No dishes found in recent selections" });
        }

        const prompt = `
            You're a creative social media marketer for a trendy restaurant.
            You are creating a restaurant promotion based on the following dishes: ${uniqueNames.join(", ")}.
            
            Your job is to:
            - Infer the most likely ingredients used in those dishes
            - Write a short, catchy promotion (1–2 sentences max)
            - Suggest the best content format (e.g. video, captioned photo, text-only post)
            
            Don't mention ingredients in the final output.

            Make the tone ${tone}.
            Return the content in this structure:

            1. Instagram Post:
               - Caption (with emojis)
               - Hashtags (trendy, food-related, discoverable)
            
            2. Facebook Post:
               - Caption (engaging, slightly longer, community tone)
               - Hashtags
            
            3. TikTok Idea:
               - Hook / Video Concept
               - Caption suggestion
               - Hashtags
            
            4. X (Twitter) Post:
               - Short & witty caption (under 280 characters)
               - Hashtags
            
            Keep each part **platform-specific**, fun, and on-trend. Avoid repeating the dish list – just use it to inspire. 
            Do **not** include the word "dishes" or "ingredients" in the output.
            `;

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a senior restaurant social media assistant generating platform-tailored content." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
        });

        const responseText = chatResponse.choices[0].message.content;

        // Optional: store in DB
        await db.collection("adminPromotions").add({
            tone,
            selections: uniqueNames,
            content: responseText,
            generatedAt: new Date()
        });

        res.json({ suggestion: responseText });
    } catch (err) {
        console.error("❌ Admin GPT Promo Error:", err);
        res.status(500).json({ error: "Failed to generate admin promo" });
    }
});

router.get('/suggest-dish', async (req, res) => {
    try {
        const snapshot = await db
            .collection("menuSelections")
            .orderBy("createdAt", "desc")
            .limit(25)
            .get();

        const dishCounts = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            if (Array.isArray(data.items)) {
                data.items.forEach(item => {
                    dishCounts[item.name] = (dishCounts[item.name] || 0) + 1;
                });
            }
        });

        const sortedDishes = Object.entries(dishCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);

        if (sortedDishes.length === 0) {
            return res.json({ suggestion: "Explore today's special selections!" });
        }

        const topDishes = sortedDishes.slice(0, 5).join(", ");

        const prompt = `From the following frequently ordered dishes: ${topDishes}, choose one and write a friendly suggestion like "We recommend trying X today!" or "Customers are loving Y – try it!". Keep it short and clear. Return only the suggestion sentence.`;

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful restaurant assistant recommending dishes to customers based on popular trends."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 40,
        });

        const suggestion = chatResponse.choices[0].message.content.trim();
        return res.json({ suggestion });

    } catch (err) {
        console.error("❌ Dish suggestion error:", err);
        res.status(500).json({ error: "Failed to generate dish suggestion." });
    }
});




module.exports = router;
