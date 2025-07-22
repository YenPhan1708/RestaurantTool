const express = require('express');
const router = express.Router();
const db = require('../firebaseService');

router.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing feedback data' });
    }

    try {
        const feedbackRef = db.collection('feedback').doc();
        await feedbackRef.set({ name, email, message, createdAt: new Date() });
        res.status(201).json({ message: 'Feedback sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

module.exports = router;
