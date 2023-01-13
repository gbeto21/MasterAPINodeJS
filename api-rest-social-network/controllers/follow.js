const Follow = require("../models/follow");
const User = require("../models/user");
const mongoosePaginate = require("mongoose-pagination");

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

const unfollow = async (req, res) => {
  let message;
  try {
    const follower = req.user.id;
    const followed = req.params.id;

    await Follow.findOneAndDelete({
      user: follower,
      followed: followed,
    }).exec();

    message = "Unfollow saved.";
    return res.status(201).json({ message });
  } catch (error) {
    message = "General error on unfollow.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

const getFollowing = async (req, res) => {
  let message;
  try {
    const userFollower = req.params.id || req.user.id;
    const page = req.params.page || "1";

    const itemsPerPage = 5;
    const usersFollowing = await Follow.find({ user: userFollower })
      .populate("user followed", "-password -role -__v")
      .paginate(page, itemsPerPage);

    return res.status(201).json({ usersFollowing });
  } catch (error) {
    message = "General error getting following.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

const getFollowers = async (req, res) => {
  let message;
  try {
    message = "Get followers.";
    return res.status(201).json({ message });
  } catch (error) {
    message = "General error getting followers.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

module.exports = { follow, unfollow, getFollowing, getFollowers };
