const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Post = require("../models/post");
const post = require("../models/post");
const User = require("../models/users");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  //we are adding pagination using countDocuments
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({
          message: "Fetched Posts",
          posts: posts,
          totalItems: totalItems,
        });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

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
    const error = new Error("Validation failed , entered data is incorrect ");
    error.statusCode = 422;
    throw error;
    // return res.status(422).json({message:  , errors: errors.array(),})
  }
  console.log(req.file);
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  let creator;

  // Create post in db

  // creating a new object of post model which we defined in models
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  console.log(post);
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    }).then( user => {
      creator = user;
      user.posts.push(post);

      console.log(user);
      return user.save();
      
    })
    .then(result=> {
      res.status(201).json({
        message: "Post created successfully!",
        post: post,
        creator: {_id: creator._id , name: creator.name}
      });
    }
    )
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  // this has to match we have mentioned in routes
  // now using Post model
  Post.findById(postId)
    .then((post) => {
      console.log(post);
      if (!post) {
        console.log("Post is null");
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post Fetched", post: post });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed , entered data is incorrect ");
    error.statusCode = 422;
    throw error;
    // return res.status(422).json({message:  , errors: errors.array(),})
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        console.log("Post is null");
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      //check login user

      if (!post) {
        console.log("Post is null");
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }

      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//we are triggering this clearimage function whenever we want to update our image in update handler
const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
