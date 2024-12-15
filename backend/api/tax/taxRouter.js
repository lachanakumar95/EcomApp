const router = require('express').Router();
const taxController = require('./taxController');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
router.post('/tax', adminAuthMiddleware.verifyAccessToken, taxController.createTax);
router.put('/tax/:id', adminAuthMiddleware.verifyAccessToken, taxController.updateTax);
router.get('/tax', adminAuthMiddleware.verifyAccessToken, taxController.getTax)
//Published
router.put('/admin/published/:id', adminAuthMiddleware.verifyAccessToken, taxController.published);
//Admin panel published
router.get('/admin/tax', adminAuthMiddleware.verifyAccessToken, taxController.getTaxPublishedData);

module.exports = router;