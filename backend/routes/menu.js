const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Define routes and point them to controller methods
router.get('/', menuController.getMenu);
router.post('/import', menuController.importMenu);
router.delete('/:id', menuController.deleteMenuItem); // <- new

module.exports = router;
