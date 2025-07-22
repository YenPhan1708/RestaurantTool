const express = require('express');
const router = express.Router();
const db = require('../firebaseService');

// GET /api/menu - Fetch menu data from Firestore
router.get('/', async (req, res) => {
    console.log('✅ GET /api/menu called');

    try {
        const snapshot = await db.collection('menu').get();
        const menu = [];

        snapshot.forEach((doc) => {
            menu.push(doc.data());
        });

        res.json(menu);
    } catch (error) {
        console.error('❌ Failed to fetch menu from Firestore:', error);
        res.status(500).json({ error: 'Failed to load menu' });
    }
});

module.exports = router;
