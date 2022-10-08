const express = require('express');
const router = express.Router();

// SMongoose Database Schemas
const userModel = require('../models/user');
const postModel = require('../models/post');
const notificationModel = require("../models/notification");

router.get('/', async (req, res) => {
  const requestingUser = await userModel.findById(req.session.passport.user);
  let posts = await postModel.find({'author': requestingUser.name});
  let people = requestingUser.following.map(a => a.name);
  let personPost = await postModel.find({'author': {$in: people}})
  posts = personPost.concat(posts);
  posts.sort((x,y) => {
    if(x.time < y.time) {
      return 1;
    } else {
      return -1;
    }
  });
  res.render('index.ejs', {posts: posts, user: requestingUser});
});

router.post('/post', async (req, res) => {
  const requestingUser = await userModel.findById(req.session.passport.user);
  const post = new postModel({
    author: requestingUser.name,
    text: req.body.post,
    tips: 0,
    comments: [],
    time: Date.now(),
    shares: 0
  });
  await post.save();
  res.redirect('/home');
});

router.post('/tip', (req, res) => {
  postModel.findById(req.body.id, async function(err, post) {
    userModel.findById(req.session.passport.user, async function(err, user) {
      if(user.tokens > 0) {
        //reduce users tokens by 1
        user.tokens -= 1;
        await user.save();

        // increase tokens on post
        post.tips += 1;

        //get tipped user
        userModel.findOne({name: post.author}, async function(err, author) {
          // if post is divisible by 2 then increate author's token count
          if(post.tips % 2 == 0) {
            author.tokens += 1;
          }
          // check to see if author has tipped post before
          let index =  post.tippers.findIndex(x => x.name == user.name);
          if(index == -1) {
            post.tippers.push({name: user.name, tips: 1});
            const notification = new notificationModel({
              sender: user.name,
              receiver: author.name,
              description: `${user.name} tipped your post`,
              new: true,
            });
            await notification.save();
            await post.save();
          } else {
            post.tippers[index].tips += 1;
            await post.save();
          }
        });
        // send response
        res.json(post.tips);
      } else {
        res.json("out of coins");
      }
    });
  });
});

router.post('/comment', (req, res) => {
  console.log(req.body.text);
  console.log(req.body.postid);
  if(req.body.text !== "") {
    postModel.findById(req.body.postid, async function(err, post) {
      userModel.findById(req.session.passport.user, async function(err, user) {
        post.comments.push({name: user.name, text: req.body.text});
        await post.save();
        const data = {
          name: user.name,
          text: req.body.text
        }
        res.json(data);
      })
    })
  } else {
    res.json({err: "cannot post an empty comment"});
  }
});

router.post('/share', async (req, res) => {
  const requestingUser = await userModel.findById(req.session.passport.user);
  const originalPost = await postModel.findById(req.body.postid);
  originalPost.shares++;
  const post = new postModel({
    author: requestingUser.name,
    kind: "shared",
    shared: {
      author: originalPost.author,
      postid: req.body.postid
    },
    text: originalPost.text,
    tips: 0,
    comments: [],
    time: originalPost.time
  });
  await post.save();
  res.json(req.body);
});

module.exports = router;
