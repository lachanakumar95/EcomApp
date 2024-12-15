const router = require('express').Router();
const tagsController = require('./tagsController');
const fileUploadMiddleware = require('../../middleware/fileUploadMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');

router.post('/tags', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, tagsController.createTags);
router.put('/tags/:id', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, tagsController.editTags);
router.delete('/tags/:id', adminAuthMiddleware.verifyAccessToken, tagsController.deleteTags);
router.get('/tags', adminAuthMiddleware.verifyAccessToken, tagsController.getTags);

//Admin tags Published
router.get('/admin/tags', adminAuthMiddleware.verifyAccessToken, tagsController.getTagsPublished);

// //Setting of Brand
router.put('/tags/published/:id', adminAuthMiddleware.verifyAccessToken, tagsController.published);

module.exports = router;


