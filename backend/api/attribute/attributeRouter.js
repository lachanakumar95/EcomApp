const router = require('express').Router();
const attributeController = require('./attributeController');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');

router.post('/attribute', adminAuthMiddleware.verifyAccessToken, attributeController.createAttribute);
router.put('/attribute/:id', adminAuthMiddleware.verifyAccessToken, attributeController.editAttribute);
router.delete('/attribute/:id', adminAuthMiddleware.verifyAccessToken, attributeController.deleteAttribute);
router.get('/attribute', adminAuthMiddleware.verifyAccessToken, attributeController.getAttribute);
router.get('/admin/attribute', adminAuthMiddleware.verifyAccessToken, attributeController.getAttributePublished);

//Settings
router.put('/attribute/published/:id', adminAuthMiddleware.verifyAccessToken, attributeController.published);

module.exports = router;