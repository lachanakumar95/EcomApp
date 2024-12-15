const router = require('express').Router();
const categoryController = require('./categoryController');
const userAuthController = require('../../../middleware/userAuthMiddleware');
router.get('/category', userAuthController.verifyAccessToken, categoryController.getCategory);
module.exports = router;