const express = require('express');
const router = express.Router();
const db = require('../firebaseService');
const { OpenAI } = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper: Analyze prompt with OpenAI
async function analyzeTextWithAI(prompt) {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: "You are a helpful assistant analyzing customer feedback." },
            { role: "user", content: prompt }
        ],
        temperature: 0.6
    });

    return response.choices?.[0]?.message?.content;
}

// POST /api/feedback - Submit feedback
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing feedback data' });
    }

    try {
        await db.collection('feedback').add({
            name,
            email,
            message,
            createdAt: new Date()
        });

        res.status(201).json({ message: '✅ Feedback sent successfully' });
    } catch (error) {
        console.error('❌ Error saving feedback:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// GET /api/feedback - Retrieve all feedback
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('feedback').orderBy('createdAt', 'desc').get();
        const feedbacks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('❌ Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// POST /api/feedback/analyze - Analyze stored feedback from Firestore
router.post('/analyze', async (req, res) => {
    try {
        const snapshot = await db.collection('feedback').orderBy('createdAt', 'desc').get();
        const messages = snapshot.docs.map(doc => doc.data().message).filter(Boolean);

        if (messages.length === 0) {
            return res.status(404).json({ error: 'No feedback messages found in the database.' });
        }

        const combined = messages.slice(0, 20).join('\n---\n'); // Limit to 20 most recent
        const prompt = `
You are a feedback analysis assistant. Here is a collection of customer reviews:

${combined}

Analyze the above feedback:
1. Overall sentiment (Positive, Negative, Neutral)
2. Common themes customers mention
3. Actionable suggestions for improvement
        `;

        const aiResponse = await analyzeTextWithAI(prompt);
        res.json({ analysis: aiResponse || "No insights generated." });
    } catch (err) {
        console.error("❌ AI analysis error:", err);
        res.status(500).json({ error: 'Failed to analyze feedback from database.' });
    }
});

module.exports = router;
