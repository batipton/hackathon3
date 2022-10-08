const express = require('express');
const router = express.Router();

// SMongoose Database Schemas
const userModel = require('../models/user');
const postModel = require('../models/post');

router.get('/', async (req, res) => {
  const requestingUser = await userModel.findById(req.session.passport.user);
  const posts = await postModel.find().sort( {"tips" : -1}).limit(10);
  res.render('index.ejs', {posts: posts, user: requestingUser});
});

module.exports = router;
