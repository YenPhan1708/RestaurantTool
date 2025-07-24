const express = require('express');
const router = express.Router();
const db = require('../firebaseService');

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
            createdAt: new Date(),
            ip: clientIp, // <-- save IP here
        });

        res.status(201).json({ message: 'Selection saved successfully' });
    } catch (err) {
        console.error('Error saving selection:', err);
        res.status(500).json({ message: 'Failed to save selection' });
    }
});

module.exports = router;
