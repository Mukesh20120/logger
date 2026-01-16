const router = require('express').Router();
const {register, login, logoutController, refreshTokencontroller} = require('../controller/authController');

router.post('/register', register);
router.post('/login',login);
router.post('/refresh',refreshTokencontroller);
router.get('/logout',logoutController);

module.exports = router;