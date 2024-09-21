const express = require('express');
//import route handler functionns for user routes
const userController = require('./../controller/userController');
//import authentication middlewhere
const authController = require('./../auth/auth');
const router = express.Router();

//API ENDPOINTS FOR AN AUTHOR
router.get('/author',authController.authenticationFunction,userController.getAllPosts);
//router.get('/user',authController.authenticationFunction,userController.getUser);

//API ENDPOINTS FOR SIGNUP AND LOGIN
router.post('/auth/signup',authController.signUp);
router.post('/auth/login',authController.login);

module.exports = router;