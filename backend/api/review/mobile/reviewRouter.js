const router = require('express').Router();
const userAuthMiddleware = require('../../../middleware/userAuthMiddleware');
const reviewController = require('./reviewController');
router.post('/review', userAuthMiddleware.verifyAccessToken, reviewController.createReview)
module.exports = router;