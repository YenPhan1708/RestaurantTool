const express = require('express');
const router = express.Router();
const db = require('../firebaseService');

// POST /api/feedback
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

// GET /api/feedback
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


module.exports = router;
