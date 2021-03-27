const express = require('express');
const router = express();

const controller = require('../controller/controller.js');

//GET
router.get('/signup', controller.signupGet);

router.get('/login', controller.loginGet);

//POST
router.post('/signup', controller.signupPost);

router.post('/login', controller.loginPost);

//Log Out
router.get('/logout', controller.logoutGet);



module.exports = router;