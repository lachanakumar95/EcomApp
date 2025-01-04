const router = require('express').Router();
const generalinfoController = require('./generalinfoController');
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');
const fileUploadMiddleware = require('../../../middleware/fileUploadMiddleware');

router.post('/generalinfo', adminAuthMiddleware.verifyAccessToken, fileUploadMiddleware, generalinfoController.createUpdateRecords)
router.get('/generalinfo', generalinfoController.getGerneralInfo);
module.exports = router;