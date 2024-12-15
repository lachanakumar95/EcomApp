const router = require('express').Router();
const userAuthMiddleware = require('../../../middleware/userAuthMiddleware');
const cartController = require('./cartController');

router.post('/addtocart', userAuthMiddleware.verifyAccessToken, cartController.addToCart);
router.delete('/addtocart', userAuthMiddleware.verifyAccessToken, cartController.removeFromCart);
router.get('/addtocart', userAuthMiddleware.verifyAccessToken, cartController.getCart);

module.exports = router;