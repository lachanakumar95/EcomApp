const router = require('express').Router();
const adminAuthmiddleware = require('../../../middleware/adminAuthMiddleware');
const loginConfigController = require('./loginConfigController');

router.post('/loginconfig', adminAuthmiddleware.verifyAccessToken, loginConfigController.createLoginConfig);
router.get('/loginconfig', loginConfigController.getLoginConfig);

module.exports = router;