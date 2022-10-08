const mongoose = require("mongoose"); 

const PostSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    default: "original",
  },
  shares: {
    type: Number,
    required: true
  },
  shared: {
    author: {
      type: String
    },
    postid: {
      type: mongoose.ObjectId
    }
  },
  text: {
    type: String,
    required: true,
  },
  tips: {
    type: Number,
    required: true,
  },
  tippers: [{
    name: String,
    tips: Number,
    time: Date,
  }],
  comments: [{
    name: String,
    text: String,
    tips: Number,
    time: Date,
  }],
  time: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
