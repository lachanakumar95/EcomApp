// routes/authRoutes.js
const express = require('express');
const googleloginController = require('./googleloginController');
const router = express.Router();

router.get('/google', googleloginController.googleLogin);

router.get('/google/callback', googleloginController.googleCallback, googleloginController.googleCallbackRedirect);

router.get('/logout', googleloginController.logout);

module.exports = router;
