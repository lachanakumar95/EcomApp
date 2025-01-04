const router = require('express').Router();
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');
const policyController = require('./policyController');

router.post('/policymangement', adminAuthMiddleware.verifyAccessToken, policyController.createUpdate);
router.get('/policymangement', policyController.getPolicy);

module.exports = router;