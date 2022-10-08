const express = require('express');
const router = express.Router();

// SMongoose Database Schemas
const userModel = require("../models/user");
const postModel = require("../models/post");
const notificationModel = require("../models/notification");

router.get('/:name', async (req, res) => {
  const requestedUser = await userModel.findOne({'name': req.params.name});
  if(requestedUser !== null) {
    const requestingUser = await userModel.findById(req.session.passport.user);
    const following = requestingUser.following.filter(person => {
      return person.name === requestedUser.name
    }).length !== 0;
    const posts = await postModel.find({'author': requestedUser.name});
    posts.sort((x,y) => {
      if(x.time < y.time) {
        return 1;
      } else {
        return -1;
      }
    });
    if(requestedUser._id.equals(requestingUser._id)) {
      res.render('profile.ejs', {user: requestingUser, userinfo: requestingUser, posts: posts, meta: {
        home: true,
        following: null
      }});
    } else {
      res.render('profile.ejs', {user: requestingUser, userinfo: requestedUser, following: following, posts: posts, meta: {
        home: false,
        following: following
      }});
    }
  } else {
    res.send('Hmmm... that page does not exist');
  }
});

router.post('/follow', (req, res) => {
  userModel.findById(req.session.passport.user, async function(err, user) {
    userModel.findOne({'name': req.body.name}, async function(err, following) {
      const notification = new notificationModel({
        sender: user.name,
        receiver: following.name,
        description: `${user.name} is now following you`,
        new: true,
      });
      await notification.save();
      user.following.push({'name': following.name});
      following.followers.push({'name': user.name});
      await user.save();
      await following.save();
      res.json({num: 2});
    })
  })
});

router.post('/unfollow', (req, res) => {
  userModel.findById(req.session.passport.user, async function(err, user) {
    userModel.findOne({'name': req.body.name}, async function(err, following) {
      user.following.pop({'name': following.name});
      following.followers.pop({'name': user.name});
      await user.save();
      await following.save();
      res.json({num: 2});
    })
  })
});

module.exports = router;
