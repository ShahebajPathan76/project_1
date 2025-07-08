const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

// 🔍 Search users by name or email
router.get("/search", verifyToken, async (req, res) => {
  try {
    const query = req.query.q;

    const users = await User.find({
      $or: [
        { firstname: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("firstname email username _id");

    res.json(users);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ➕ Add a friend
router.post("/add-friend/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.id;

    if (userId === friendId)
      return res.status(400).json({ error: "Cannot add yourself" });

    const user = await User.findById(userId);
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    res.json({ success: true, message: "Friend added" });
  } catch (err) {
    console.error("Add Friend Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ➖ Remove a friend
router.post("/remove-friend/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.friends = user.friends.filter(
      (friendId) => friendId.toString() !== req.params.id
    );
    await user.save();
    res.json({ success: true, message: "Friend removed" });
  } catch (err) {
    console.error("Remove Friend Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 📄 Get current user's friends
// GET /api/friends/list
router.get("/list", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends", "firstname email _id");
    res.json(user.friends);
  } catch (err) {
    console.error("Get Friends Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
