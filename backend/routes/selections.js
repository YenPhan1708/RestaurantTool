// routes/selections.js
const express = require('express');
const router = express.Router();
const db = require('../firebaseService'); // assumes Firestore is initialized

router.post('/', async (req, res) => {
    const { selectedItems } = req.body;

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
        return res.status(400).json({ message: 'No items to save' });
    }

    try {
        await db.collection('menuSelections').add({
            items: selectedItems,
            createdAt: new Date(),
        });
        res.status(201).json({ message: 'Selection saved successfully' });
    } catch (err) {
        console.error('Error saving selection:', err);
        res.status(500).json({ message: 'Failed to save selection' });
    }
});

module.exports = router;
