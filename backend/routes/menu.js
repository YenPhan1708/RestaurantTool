const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Define routes and point them to controller methods
router.get('/', menuController.getMenu);
router.post('/import', menuController.importMenu);
router.delete('/:docId/item/:itemIndex', menuController.deleteMenuItemFromCategory);
router.post('/:docId/item', menuController.addMenuItemToCategory);
router.put('/:docId/item/:itemIndex', menuController.editMenuItemInCategory);

module.exports = router;
