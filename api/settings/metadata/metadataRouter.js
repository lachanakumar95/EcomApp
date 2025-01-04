const router = require('express').Router();
const metadataController = require('./metadataController');
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');

router.post('/metadatainfo', adminAuthMiddleware.verifyAccessToken,  metadataController.createUpdateRecords);
router.get('/getMetaContent', metadataController.getMetaContent);

module.exports = router;