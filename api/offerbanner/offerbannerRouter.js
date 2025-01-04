const router = require('express').Router();
const offerbannerController = require('./offerbannerController');
const fileUploadMiddleware = require('../../middleware/fileUploadMiddleware');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');

router.post('/offerbanner', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, offerbannerController.createOfferbanner);
router.put('/offerbanner/:id', fileUploadMiddleware, adminAuthMiddleware.verifyAccessToken, offerbannerController.editOfferbanner);
router.delete('/offerbanner/:id', adminAuthMiddleware.verifyAccessToken, offerbannerController.deleteOfferbanner);
router.get('/offerbanner', adminAuthMiddleware.verifyAccessToken, offerbannerController.getofferBanner);

// //Setting of Brand
router.put('/offerbanner/published/:id', adminAuthMiddleware.verifyAccessToken, offerbannerController.published);

module.exports = router;


