const router = require('express').Router();
const subcategoryController = require('./subcategoryController');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');
const fileUploadMiddleware = require('../../middleware/fileUploadMiddleware');

router.post('/subcategory', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, subcategoryController.subCreateCategory);
router.put('/subcategory/:id', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, subcategoryController.editSubcategory);
router.delete('/subcategory/:id', adminAuthMiddleware.verifyAccessToken, subcategoryController.deleteSubcategory);
router.get('/subcategory', adminAuthMiddleware.verifyAccessToken, subcategoryController.getSubcategory);
router.get('/admin/subcategory/:id', adminAuthMiddleware.verifyAccessToken, subcategoryController.getSubcategoryBasedParent);

// //Setting of category
router.put('/subcategory/hoemdisplay/:id', adminAuthMiddleware.verifyAccessToken, subcategoryController.homeDisplay);
router.put('/subcategory/published/:id', adminAuthMiddleware.verifyAccessToken, subcategoryController.published);

module.exports = router;