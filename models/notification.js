const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  new: {
    type: Boolean,
    required: true,
  }
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
