const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: {
    type: String, // app | chat | user
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
