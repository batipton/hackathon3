const express = require('express');
const router = express.Router();

// SMongoose Database Schemas
const userModel = require('../models/user');
const postModel = require('../models/post');

router.post('/', async (req, res) => {
  let data = [];
  if(req.body.text != "") {
    data = await userModel.find({name: { $regex: req.body.text, $options: 'i'}})
    .limit(5);
  }
  res.json({data: data});
})

module.exports = router;
