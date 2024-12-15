const router = require('express').Router();
const brandController = require('./brandController');
const fileUploadMiddleware = require('../../middleware/fileUploadMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');

router.post('/brand', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, brandController.createBrand);
router.put('/brand/:id', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, brandController.editBrand);
router.delete('/brand/:id', adminAuthMiddleware.verifyAccessToken, brandController.deleteBrand);
router.get('/brand', adminAuthMiddleware.verifyAccessToken, brandController.getBrand);
//Admin Panel brand published
router.get('/admin/brand', adminAuthMiddleware.verifyAccessToken, brandController.getBrandPublished);

// //Setting of Brand
router.put('/brand/published/:id', adminAuthMiddleware.verifyAccessToken, brandController.published);

module.exports = router;


