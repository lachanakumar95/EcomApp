const router = require('express').Router();
const addressController = require('./addressController');
const userAuthMiddleware = require('../../../middleware/userAuthMiddleware');
router.post('/address', userAuthMiddleware.verifyAccessToken, addressController.createAddress);
module.exports = router;