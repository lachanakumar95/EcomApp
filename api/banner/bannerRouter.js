const router = require('express').Router();
const bannerController = require('./bannerController');
const fileUploadMiddleware = require('../../middleware/fileUploadMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');

router.post('/banner', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, bannerController.createBanner);
router.put('/banner/:id', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, bannerController.editBanner);
router.delete('/banner/:id', adminAuthMiddleware.verifyAccessToken, bannerController.deleteBanner);
router.get('/banner', adminAuthMiddleware.verifyAccessToken, bannerController.getBanner);

// //Setting of Brand
router.put('/banner/published/:id', adminAuthMiddleware.verifyAccessToken, bannerController.published);

module.exports = router;


