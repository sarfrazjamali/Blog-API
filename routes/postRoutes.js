const express = require('express');
//import route controller functions for posts
const postController = require('./../controller/postController');
//IMPORT AUTHENTICATION MIDDLEWRAE FOR USER
const authController = require('./../auth/auth')
//create router;
const router = express.Router();


//API ENDPOINTS
router.get('/',postController.getAllPublishedPosts);
router.get('/:postId',postController.getSinglePublishedPost);
router.post('/',authController.authenticationFunction,postController.createPost);
router.put('/:postId',authController.authenticationFunction,postController.updatePost);
router.delete('/:postId',authController.authenticationFunction,postController.deletePost);

module.exports = router;
