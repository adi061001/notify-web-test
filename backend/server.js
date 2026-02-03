const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(
    "mongodb+srv://testuser:Test1234@cluster0.ssmoz3a.mongodb.net/notificationDB?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err.message));

// Notification model
const Notification = require("./modals/Notification");

// Routes
app.post("/api/notifications", async (req, res) => {
  const notification = await Notification.create(req.body);

  // Emit notification to all connected clients
  io.emit("newNotification", notification);

  res.json(notification);
});

app.get("/api/notifications/unread", async (req, res) => {
  const notifications = await Notification.find({ isRead: false });
  res.json(notifications);
});

app.put("/api/notifications/:id/read", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("Notify backend is live 🚀");
});
// Socket.io connection
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
