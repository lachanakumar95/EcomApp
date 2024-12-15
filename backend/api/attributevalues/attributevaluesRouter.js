const router = require('express').Router();
const attributevaluesController = require('./attributevaluesCategory');
const adminAuthMiddleware = require('../../middleware/adminAuthMiddleware');

router.post('/attributevalues', adminAuthMiddleware.verifyAccessToken, attributevaluesController.createAttributevalue);
router.put('/attributevalues/:id', adminAuthMiddleware.verifyAccessToken, attributevaluesController.editAttributevalue);
router.delete('/attributevalues/:id', adminAuthMiddleware.verifyAccessToken, attributevaluesController.deleteAttributevalues);
router.get('/attributevalues/:id', adminAuthMiddleware.verifyAccessToken, attributevaluesController.getAttributevalues);
router.get('/attributevalues', adminAuthMiddleware.verifyAccessToken, attributevaluesController.getAllAttributevalues);
//Admin Panel
router.get('/admin/attributevalues/:id', adminAuthMiddleware.verifyAccessToken, attributevaluesController.getAttributevaluesPublished);

//Settings
router.put('/attributevalues/published/:id', adminAuthMiddleware.verifyAccessToken, attributevaluesController.published);
module.exports = router;