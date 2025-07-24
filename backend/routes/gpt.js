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

module.exports = router;
