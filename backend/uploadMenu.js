// uploadMenu.js
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
});

const db = admin.firestore();

// Sample menu data
const menuData = [
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

async function uploadMenu() {
    const batch = db.batch();

    menuData.forEach((section) => {
        const docRef = db.collection('menu').doc(section.category.toLowerCase().replace(/ & /g, '_').replace(/\s+/g, '_'));
        batch.set(docRef, section);
    });

    try {
        await batch.commit();
        console.log('✅ Menu uploaded successfully to Firestore.');
    } catch (err) {
        console.error('❌ Error uploading menu:', err);
    }
}

uploadMenu();
