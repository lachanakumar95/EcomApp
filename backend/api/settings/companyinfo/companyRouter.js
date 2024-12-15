const router = require('express').Router();
const companyController = require('./companyController');
const adminAuthMiddleware = require('../../../middleware/adminAuthMiddleware');

router.post('/companyinfo', adminAuthMiddleware.verifyAccessToken, companyController.createUpdateRecords);
router.get('/companyinfo', companyController.getCompanyInfo);

module.exports = router;