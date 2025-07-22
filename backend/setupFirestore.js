const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function setupCollections() {
    try {
        // Add placeholder to feedback collection
        await db.collection('feedback').doc('placeholder').set({
            name: '',
            email: '',
            message: '',
            createdAt: new Date()
        });

        // Add placeholder to reservations collection
        await db.collection('reservations').doc('placeholder').set({
            date: '',
            time: '',
            guests: '',
            createdAt: new Date()
        });

        console.log('✅ Firestore collections "feedback" and "reservations" created with placeholders.');
    } catch (error) {
        console.error('❌ Error initializing Firestore collections:', error);
    }
}

setupCollections();
