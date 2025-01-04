const router = require('express').Router();
const productController = require('./productController');
const fileuploadMiddleware = require('../../middleware/fileUploadMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');

router.post('/product', fileuploadMiddleware, adminAuthMiddleware.verifyAccessToken, productController.createProduct);
router.put('/product/:id', fileuploadMiddleware, adminAuthMiddleware.verifyAccessToken, productController.updateProduct);
router.get('/product', adminAuthMiddleware.verifyAccessToken, productController.getProductDetails);
//router.delete('/product/:id', adminAuthMiddleware.verifyAccessToken, productController.deleteProduct);

//Setting in published the product
router.put('/product/published/:id', adminAuthMiddleware.verifyAccessToken, productController.published);
//Setting in Outofstock the product
router.put('/product/outOfStock/:id', adminAuthMiddleware.verifyAccessToken, productController.outOfStock);

module.exports = router;