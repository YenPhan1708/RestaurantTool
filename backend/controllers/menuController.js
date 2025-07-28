const db = require('../firebaseService');

// GET /api/menu
exports.getMenu = async (req, res) => {
    console.log('✅ GET /api/menu called');
    try {
        const snapshot = await db.collection('menu').get();
        const menu = [];
        snapshot.forEach((doc) => {
            menu.push({ id: doc.id, ...doc.data() });
        });
        res.json(menu);
    } catch (error) {
        console.error('❌ Failed to fetch menu from Firestore:', error);
        res.status(500).json({ error: 'Failed to load menu' });
    }
};

// POST /api/menu/import
exports.importMenu = async (req, res) => {
    const { menu } = req.body;

    if (!Array.isArray(menu)) {
        return res.status(400).json({ error: "Invalid format. Expected 'menu' as an array." });
    }

    try {
        const batch = db.batch();
        menu.forEach(item => {
            const docRef = db.collection('menu').doc(); // Auto-generate ID
            batch.set(docRef, item);
        });
        await batch.commit();
        res.json({ message: "✅ Menu imported successfully", count: menu.length });
    } catch (error) {
        console.error('❌ Error importing menu:', error);
        res.status(500).json({ error: 'Failed to import menu' });
    }
};

// DELETE /api/menu/:docId/item/:itemIndex
exports.deleteMenuItemFromCategory = async (req, res) => {
    const { docId, itemIndex } = req.params;

    try {
        const docRef = db.collection('menu').doc(docId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Document not found" });
        }

        const data = doc.data();
        data.items.splice(itemIndex, 1); // remove item at index

        await docRef.update({ items: data.items });
        res.json({ message: "Item deleted from category" });
    } catch (err) {
        console.error("Delete item from category failed:", err);
        res.status(500).json({ error: "Failed to delete item" });
    }
};

// In menuController.js
exports.addMenuItemToCategory = async (req, res) => {
    const { docId } = req.params;
    const { name, price } = req.body;

    try {
        const docRef = db.collection('menu').doc(docId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Category not found" });
        }

        const data = doc.data();
        const newItem = { name, price };
        const updatedItems = [...data.items, newItem];

        await docRef.update({ items: updatedItems });
        res.json({ message: "Item added successfully" });
    } catch (err) {
        console.error("Failed to add item:", err);
        res.status(500).json({ error: "Failed to add item" });
    }
};

exports.editMenuItemInCategory = async (req, res) => {
    const { docId, itemIndex } = req.params;
    const { name, price, newCategoryId } = req.body;

    try {
        const docRef = db.collection('menu').doc(docId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Original category not found" });
        }

        const data = doc.data();
        const item = data.items[itemIndex];

        if (!item) {
            return res.status(404).json({ error: "Item not found in original category" });
        }

        const updatedItem = { name, price };

        // If category is unchanged, just update item in place
        if (!newCategoryId || newCategoryId === docId) {
            data.items[itemIndex] = updatedItem;
            await docRef.update({ items: data.items });
            return res.json({ message: "Item updated in same category" });
        }

        // Else: Move to different category
        const newDocRef = db.collection('menu').doc(newCategoryId);
        const newDoc = await newDocRef.get();

        if (!newDoc.exists) {
            return res.status(404).json({ error: "New category not found" });
        }

        // Remove from old
        data.items.splice(itemIndex, 1);
        await docRef.update({ items: data.items });

        // Add to new
        const newItems = [...newDoc.data().items, updatedItem];
        await newDocRef.update({ items: newItems });

        return res.json({ message: "Item moved and updated successfully" });
    } catch (err) {
        console.error("Failed to edit item:", err);
        res.status(500).json({ error: "Failed to update item" });
    }
};

