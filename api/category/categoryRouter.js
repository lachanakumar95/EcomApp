const router = require('express').Router();
const categoryController = require('./categoryController');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const fileUploadMiddleware = require('../../middleware/fileUploadMiddleware');

router.post('/category', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, categoryController.createCategory);
router.put('/category/:id', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, categoryController.editCategory);
router.delete('/category/:id', adminAuthMiddleware.verifyAccessToken, categoryController.deleteCategory);
router.get('/category', adminAuthMiddleware.verifyAccessToken, categoryController.getCategory);
router.get('/admin/category', adminAuthMiddleware.verifyAccessToken, categoryController.getCategorypublished);

//Setting of category
router.put('/category/hoemdisplay/:id', adminAuthMiddleware.verifyAccessToken, categoryController.homeDisplay);
router.put('/category/published/:id', adminAuthMiddleware.verifyAccessToken, categoryController.published);

module.exports = router;