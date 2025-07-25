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
            .orderBy("timestamp", "desc")
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
            .orderBy("timestamp", "desc")
            .limit(limit)
            .get();

        const allItems = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (Array.isArray(data.items)) {
                allItems.push(...data.items);
            }
        });

        const uniqueNames = [...new Set(allItems.map(i => i.name))];
        const uniqueIngredients = [...new Set(allItems.flatMap(i => i.ingredients || []))];

        const prompt = `
Generate a persuasive restaurant promotion based on these dishes: ${uniqueNames.join(", ")}.
Use a ${tone} tone. 
The promotion should:
- Reflect the ingredients: ${uniqueIngredients.join(", ") || "N/A"}
- Be suitable for posting online (social media) or in-store
- Suggest a content format (e.g. short video, photo with caption, text-only post)
Return:
1. The promo text (1-2 sentences max)
2. A suggested content type/format
`;

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a senior restaurant marketer helping a local brand create content." },
                { role: "user", content: prompt }
            ],
            max_tokens: 200,
        });

        const responseText = chatResponse.choices[0].message.content;

        // Optional: store in DB
        await db.collection("adminPromotions").add({
            tone,
            selections: uniqueNames,
            ingredients: uniqueIngredients,
            content: responseText,
            generatedAt: new Date()
        });

        res.json({ suggestion: responseText });
    } catch (err) {
        console.error("❌ Admin GPT Promo Error:", err);
        res.status(500).json({ error: "Failed to generate admin promo" });
    }
});


module.exports = router;
