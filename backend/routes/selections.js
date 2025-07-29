const express = require('express');
const router = express.Router();
const db = require('../firebaseService');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("✅ selections.js loaded");

router.post('/', async (req, res) => {
    const { selectedItems } = req.body;

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
        return res.status(400).json({ message: 'No items to save' });
    }

    try {
        // Get client IP
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const clientIp = Array.isArray(ip) ? ip[0] : ip;

        await db.collection('menuSelections').add({
            items: selectedItems,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ip: clientIp, // <-- save IP here
        });

        res.status(201).json({ message: 'Selection saved successfully' });
    } catch (err) {
        console.error('Error saving selection:', err);
        res.status(500).json({ message: 'Failed to save selection' });
    }
});

router.get('/', async (req, res) => {
    console.log("🔍 GET /api/selections called");
    try {
        const snapshot = await db.collection('menuSelections').orderBy('createdAt', 'desc').get();
        console.log("📦 Firestore snapshot size:", snapshot.size);

        const selections = [];
        snapshot.forEach(doc => {
            selections.push({ id: doc.id, ...doc.data() });
        });

        console.log("✅ Returning selections:", selections.length);
        res.json(selections);
    } catch (err) {
        console.error('🔥 Error fetching selections:', err.message);
        res.status(500).json({ message: 'Failed to fetch selections' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection('menuSelections').doc(id).delete();
        res.status(200).json({ message: 'Order deleted' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

// AI Order Analysis - POST /api/selections/analyze
router.post('/analyze', async (req, res) => {
    try {
        const snapshot = await db.collection('menuSelections').get();
        const selections = snapshot.docs.map(doc => doc.data());

        const items = [];
        selections.forEach(sel => {
            if (Array.isArray(sel.items)) {
                sel.items.forEach(item => {
                    items.push({
                        name: item.name,
                        quantity: item.quantity || 1
                    });
                });
            }
        });

        const prompt = `
You're a restaurant assistant AI. Based on the order data below:

1. 🍽 Show the **Top Dish** (most frequently ordered)
2. 🚀 Suggest what dish or combo to promote
3. 💡 Recommend a new dish idea if needed

Format your response like this:

Top Dish: Spicy Chicken Wings  
🚀 Promote combo deals including Spicy Chicken Wings and Fried Rice  
💡 Introduce a new vegan bowl — many users skip vegetarian options  
🆕 Try limited-time Garlic Butter Shrimp — seafood is underrepresented

Keep it short, use new lines, and **bold only labels** (Top Dish:, Promote:, etc.)

Order items:
${JSON.stringify(items, null, 2)}
`;


        const chat = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You analyze restaurant orders and give short actionable insights." },
                { role: "user", content: prompt }
            ],
            temperature: 0.5
        });

        const result = chat.choices[0]?.message?.content || "No analysis returned.";
        res.json({ analysis: result });

    } catch (err) {
        console.error("❌ Error in AI order analysis:", err);
        res.status(500).json({ error: "Failed to analyze order selections." });
    }
});

module.exports = router;
