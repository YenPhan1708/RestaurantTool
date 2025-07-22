const express = require('express');
const router = express.Router();

const sampleMenu = [
    {
        category: 'Starters',
        image: '/assets/starter.png',
        items: [
            { name: 'Grilled Okra and Tomatoes', price: 20 },
            { name: 'Cucumber Salad', price: 12 },
            { name: 'Basil Pancakes', price: 18 },
        ],
    },
    {
        category: 'Mains',
        image: '/assets/main.png',
        items: [
            { name: 'Deep Sea Cod Fillet', price: 20 },
            { name: 'Steak With Rosemary', price: 22 },
            { name: 'Grilled Kimchi Steaks', price: 20 },
        ],
    },
    {
        category: 'Pastries & Drinks',
        image: '/assets/dessert.png',
        items: [
            { name: 'Wine Pairing', price: 158 },
            { name: 'Natural Wine Pairing', price: 168 },
            { name: 'Whisky Flyer', price: 90 },
        ],
    },
];

// GET /api/menu - return the menu
router.get('/', (req, res) => {
    console.log('✅ GET /api/menu called');
    res.json(sampleMenu);
});

module.exports = router;
