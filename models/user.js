const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
    default: 20,
  },
  following: [{
    name: String,
    _id: false
  }],
  followers: [{
    name: String,
    _id: false
  }],
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  birthday: {
    type: String,
  },
  occupation: {
    type: String,
  },
  bio: {
    type: String,
  }
});
UserSchema.index({name:'text'});
const User = mongoose.model("User", UserSchema);

module.exports = User;
