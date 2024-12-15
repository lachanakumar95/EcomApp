const router = require('express').Router();
const productController = require('./productController');
const userAuthMiddleware = require('../../../middleware/userAuthMiddleware');
router.get('/products', userAuthMiddleware.verifyAccessToken, productController.getProductDetails);
router.get('/products/category/:id', userAuthMiddleware.verifyAccessToken, productController.getCategoryProduct);
router.get('/products/:id', userAuthMiddleware.verifyAccessToken, productController.getSingleProduct);
module.exports = router;