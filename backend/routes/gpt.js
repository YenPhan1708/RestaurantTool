const { OpenAI } = require("openai");
const db = require("./firebaseService");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get("/api/generate-promo", async (req, res) => {
    try {
        const snapshot = await db.collection("menuSelections").orderBy("timestamp", "desc").limit(5).get();
        const selections = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            if (Array.isArray(data.items)) {
                selections.push(...data.items.map(item => item.name));
            }
        });

        const prompt = `Create an engaging restaurant promotion post for today's special using the following dishes: ${selections.join(", ")}. 
Make it sound exciting and persuasive, suitable for social media, and include a call to action.`;

        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a creative marketing assistant for a small restaurant." },
                { role: "user", content: prompt }
            ],
        });

        const aiText = chatResponse.choices[0].message.content;
        res.json({ promotion: aiText });
    } catch (err) {
        console.error("❌ GPT Promo Error:", err);
        res.status(500).json({ error: "Failed to generate promotion" });
    }
});
