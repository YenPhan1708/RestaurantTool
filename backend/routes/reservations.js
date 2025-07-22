const express = require('express');
const router = express.Router();
const db = require('../firebaseService');

router.post('/', async (req, res) => {
    const { date, time, guests } = req.body;

    if (!date || !time || !guests) {
        return res.status(400).json({ error: 'Missing reservation data' });
    }

    try {
        const reservationRef = db.collection('reservations').doc();
        await reservationRef.set({ date, time, guests, createdAt: new Date() });
        res.status(201).json({ message: 'Reservation created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save reservation' });
    }
});

module.exports = router;
