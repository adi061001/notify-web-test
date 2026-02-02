const express = require("express");
const router = express.Router();
const Notification = require("./Notification");

// create notification
router.post("/", async (req, res) => {
  const notification = await Notification.create(req.body);
  res.json(notification);
});

// get unread notifications
router.get("/unread", async (req, res) => {
  const notifications = await Notification.find({ isRead: false });
  res.json(notifications);
});

// mark as read
router.put("/:id/read", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });
  res.json({ success: true });
});

module.exports = router;
