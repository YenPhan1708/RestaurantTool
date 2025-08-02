// routes/adminAuth.js
const express = require('express');
const router = express.Router();
const db = require('../firebaseService');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const snapshot = await db.collection('adminUsers')
            .where('username', '==', username)
            .where('password', '==', password)
            .get();

        if (snapshot.empty) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
