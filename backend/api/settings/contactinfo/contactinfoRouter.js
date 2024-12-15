const router = require('express').Router();
const contactinfoController = require('./contactinfoController');
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');

router.post('/contactinfo', adminAuthMiddleware.verifyAccessToken,  contactinfoController.createUpdateRecords);
router.get('/contactinfo', contactinfoController.getContactus);

module.exports = router;