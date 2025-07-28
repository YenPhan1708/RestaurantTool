const express = require('express');
const router = express.Router();
const db = require('../firebaseService');

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


module.exports = router;
