const router = require('express').Router();
const userController = require('./userController');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forget', userController.forgetPassword);
module.exports = router;