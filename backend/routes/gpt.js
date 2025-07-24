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
const CACHE_DURATION = 1000 * 60; // 1 hour

router.get("/generate-promo", async (req, res) => {
    const now = Date.now();
    if (cachedPromo && lastGenerated && (now - lastGenerated < CACHE_DURATION)) {
        return res.json({ promotion: cachedPromo });
    }

    try {
        const snapshot = await db
            .collection("menuSelections")
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

        const prompt = `Write ONLY ONE short, catchy sentence promoting a restaurant special based on the following dishes: ${selections.join(", ")}. Make it sound exciting and include a simple call to action.`;

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
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

        res.json({ promotion: aiText });
    } catch (err) {
        console.error("❌ GPT Promo Error:", err);
        res.status(500).json({ error: "Failed to generate promotion" });
    }
});

module.exports = router;
