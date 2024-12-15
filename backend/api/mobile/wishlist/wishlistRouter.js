const router = require('express').Router();
const userAuthMiddleware = require('../../../middleware/userAuthMiddleware');
const whishlistController = require('./wishlistController');
router.post('/whislist', userAuthMiddleware.verifyAccessToken, whishlistController.addToWishlist);
router.delete('/whislist', userAuthMiddleware.verifyAccessToken, whishlistController.removeFromWishlist);
router.get('/whislist', userAuthMiddleware.verifyAccessToken, whishlistController.getWishlist);
module.exports = router;