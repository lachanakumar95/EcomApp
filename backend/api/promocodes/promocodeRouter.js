const router = require('express').Router();
const promocodeController = require('./promocodeController');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
router.post('/promocode', adminAuthMiddleware.verifyAccessToken, promocodeController.createPromocode);
router.delete('/promocode/:id', adminAuthMiddleware.verifyAccessToken, promocodeController.deletePromocode);
router.put('/promocode/:id', adminAuthMiddleware.verifyAccessToken, promocodeController.published);
router.get('/promocode', adminAuthMiddleware.verifyAccessToken, promocodeController.getpromocode);
module.exports = router;