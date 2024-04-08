const { validationResult } = require("express-validator");


const Post = require("../models/post");
const post = require("../models/post");

exports.getPosts = (req, res, next) => {
   Post.find().then(posts => {
    res.status(200).json({message:'Fetched Posts' , posts:posts})
  }).catch(
    err => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  )
  // res.status(200).json({
  //   posts: [{
  //     _id: "1", title: 'First Post', content: 'This is the first post!', imageUrl: 'images/duck.jpg', creator: {
  //       name: "Sameer"
  //     },
  //     createdAt: new Date()
  //   }]
  // });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed , entered data is incorrect ');
    error.statusCode = 422;
    throw error;
    // return res.status(422).json({message:  , errors: errors.array(),})
  }
  console.log(req.file);
  if(!req.file){
    const error = new Error('No image provided');
    error.statusCode=422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db

  // creating a new object of post model which we defined in models 
  const post = new Post({
    title: title, content: content, imageUrl: imageUrl, creator: { name: 'Sameer' },
  });

  post.save().then(
    result => {
      console.log(result);
      res.status(201).json({
        message: 'Post created successfully!',
        post: result,
      });
    }
  ).catch(err => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  })

};


exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  // this has to match we have mentioned in routes
  // now using Post model 
  Post.findById(postId).then(post => {
    console.log(post)
    if(!post){
      console.log('Post is null')
      const error = new Error('Could not find post');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({message: 'Post Fetched' , post: post})

  }

  ).catch(err => {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

  )

}