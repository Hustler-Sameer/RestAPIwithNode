const express = require('express');
const {check} = require('express-validator');
// addding body as we are going to validate request body hence we are adding request body validator and adding validation using middlewares
const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', [
    check('title').trim().isLength({min:5}),
    // also note to keep the validators same as frontend code
    
    check('content').trim().isLength({min: 5})
], feedController.createPost);



router.get('/post/:postId' , feedController.getPost );

module.exports = router;