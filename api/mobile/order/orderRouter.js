const router = require('express').Router();
const userAuthMiddleware = require('../../../middleware/userAuthMiddleware');
const orderController = require('./orderController');
router.post('/placeorder', userAuthMiddleware.verifyAccessToken, orderController.placeOrder);
router.get('/orderlist', userAuthMiddleware.verifyAccessToken, orderController.getOrderlist);
module.exports = router;