const express = require('express');
const router = express.Router();

// SMongoose Database Schemas
const userModel = require('../models/user');
const postModel = require('../models/post');

router.get('/', async (req, res) => {
  const requestingUser = await userModel.findById(req.session.passport.user);
  res.render('wallet.ejs', {user: requestingUser});
});

module.exports = router;
