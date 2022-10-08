const express = require('express');
const router = express.Router();

// SMongoose Database Schemas
const userModel = require("../models/user");

router.get('/edit', (req, res) => {
  userModel.findById(req.session.passport.user, async function(err, user) {
    res.render('editprofile.ejs', {user: user});
  });
});

router.post('/edit', (req, res) => {
  userModel.findById(req.session.passport.user, async function(err, user) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.birthday = req.body.birthday;
    user.occupation = req.body.occupation;
    user.bio = req.body.bio;
    await user.save();
    res.redirect('./../profile/' + user.name);
  })
});

router.get('/', async (req, res) => {
  const requestingUser = await userModel.findById(req.session.passport.user);
  res.render('settings.ejs', {user: requestingUser});
})

module.exports = router;
