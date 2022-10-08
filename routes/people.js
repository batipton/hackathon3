const express = require('express');
const router = express.Router();
const sortMap = require('sort-map');

// SMongoose Database Schemas
const userModel = require('../models/user');
const postModel = require('../models/post');
const notificationModel = require('../models/notification');

router.get('/', async (req, res) => {
  const requestingUser = await userModel.findById(req.session.passport.user);
  const people = await findPeople(userModel, requestingUser);
  res.render('findpeople.ejs', {user: requestingUser, people: people});
});

// FOF algorithm - extremely bad but only going for "functionality"
// for now.
async function findPeople(userModel, user) {
  let possibleFriends = new Map();
  for(let following of user.following) {
    const userInfo = await userModel.findOne({"name": following.name});
    for(let following2 of userInfo.following){
      if(!(user.following.some(x => x.name === following2.name) || user.name === following2.name)) {
        if(possibleFriends.has(following2.name)) {
          possibleFriends.set(following2.name, possibleFriends.get(follow2.name) + 1);
        } else {
          possibleFriends.set(following2.name, 1);
        }
      }
    }
  }
  let sortedMap = sortMap(possibleFriends, ([k1, v1], [k2, v2]) => compare(v1, v2))
  let ppl = Array.from(sortedMap.keys());
  let finalResult = [];
  for(let person of ppl) {
    const userDB = await userModel.findOne({"name": person});
    const userInfo = {
      name: userDB.name,
      _id: userDB._id,
      bio: userDB.bio
    }
    finalResult.push(userInfo);
  }
  return finalResult;
}

module.exports = router;
