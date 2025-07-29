const express = require('express');
const router = express.Router();
const db = require('../firebaseService');
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/reservations
router.post('/', async (req, res) => {
    const { date, time, guests } = req.body;

    if (!date || !time || !guests) {
        return res.status(400).json({ error: 'Missing reservation data' });
    }

    try {
        await db.collection('reservations').add({
            date,
            time,
            guests,
            createdAt: new Date()
        });

        res.status(201).json({ message: '✅ Reservation submitted successfully' });
    } catch (error) {
        console.error('❌ Error saving reservation:', error);
        res.status(500).json({ error: 'Failed to save reservation' });
    }
});

// GET /api/reservations
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('reservations').orderBy('createdAt', 'desc').get();
        const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(reservations);
    } catch (error) {
        console.error('❌ Error fetching reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// AI Analysis of Reservations (POST /api/reservations/analyze)
router.post('/analyze', async (req, res) => {
    try {
        const snapshot = await db.collection("reservations").get();

        const reservations = snapshot.docs.map(doc => doc.data());

        const input = reservations.map(r => ({
            date: r.date,
            time: r.time,
            guests: r.guests
        }));

        const prompt = `
You're a restaurant AI assistant. Analyze the reservations below and summarize briefly:

1. 🔥 Peak hours (most common time slots)
2. 📅 Busiest day(s) of the week
3. 👥 Average number of guests
4. 💡 Suggest actions to improve operations or promotions

Keep your response concise (max 5 lines) and bold key for only the MOST IMPORTANT INFORMATION.
Reservation data (JSON array):
${JSON.stringify(input, null, 2)}
        `;

        const chat = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant that analyzes restaurant reservations." },
                { role: "user", content: prompt }
            ],
            temperature: 0.4,
        });

        const result = chat.choices[0]?.message?.content;
        res.json({ analysis: result || "No response generated." });

    } catch (err) {
        console.error("Error analyzing reservations:", err);
        res.status(500).json({ error: "Failed to analyze reservations." });
    }
});

module.exports = router;
