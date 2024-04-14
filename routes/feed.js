const express = require('express');
const {check} = require('express-validator');
// addding body as we are going to validate request body hence we are adding request body validator and adding validation using middlewares
const feedController = require('../controllers/feed');

const isAuth = require('../middleware/is-auth')
const router = express.Router();

// GET /feed/posts
// now this will only 
router.get('/posts', isAuth , feedController.getPosts);

// POST /feed/post
router.post('/post',  isAuth, [
    check('title').trim().isLength({min:5}),
    // also note to keep the validators same as frontend code
    
    check('content').trim().isLength({min: 5})
], feedController.createPost);



router.get('/post/:postId' ,  isAuth, feedController.getPost );

router.put('/post/:postId' ,  [
    check('title').trim().isLength({min:5}),
    // also note to keep the validators same as frontend code
    
    check('content').trim().isLength({min: 5})
] , feedController.updatePost);
//put /  patch request have request body just like post request



// delete route

router.delete('/post/:postId' , isAuth , feedController.deletePost);


module.exports = router;