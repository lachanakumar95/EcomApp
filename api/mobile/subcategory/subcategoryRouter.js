const router = require('express').Router();
const subcategoryController = require('./subcategoryController');
const userAuthController = require('../../../middleware/userAuthMiddleware');
//router.get('/subcategory/:id', userAuthController.verifyAccessToken, subcategoryController.getsubcategory);
router.get('/subcategory/:id', subcategoryController.getsubcategory);
module.exports = router;