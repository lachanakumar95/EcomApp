const router = require('express').Router();
const adminController = require('./adminController');

router.post('/admin/register', adminController.register);
router.post('/admin/login', adminController.login);
router.put('/admin/forgetpassword', adminController.forgetPassword);
module.exports = router;