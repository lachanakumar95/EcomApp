const router = require('express').Router();
const aboutusController = require('./aboutusController');
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');

router.post('/aboutusinfo', adminAuthMiddleware.verifyAccessToken, aboutusController.createUpdate);
router.get('/aboutusinfo', aboutusController.getAboutus);

module.exports = router;