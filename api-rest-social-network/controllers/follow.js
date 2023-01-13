const Follow = require("../models/follow");
const User = require("../models/user");

const follow = async (req, res) => {
  let message;
  try {
    const userFollowed = req.body.followed;
    const userFollower = req.user.id;
    const actionFollow = new Follow({
      user: userFollower,
      followed: userFollowed,
    });

    await actionFollow.save();
    message = "Follow saved.";
    return res.status(201).json({ message });
  } catch (error) {
    message = "General error on follow.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

module.exports = { follow };
