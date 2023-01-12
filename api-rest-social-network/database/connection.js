const mongoose = require("mongoose");

const connection = async () => {
  let message;
  try {
    await mongoose.connect("mongodb://localhost:27017/social_network_node");
    console.log("✅ Connected to DB.");
  } catch (error) {
    message = "❎ Error connecting to the database.";
    console.error(message, error);
  }
};

module.exports = connection;
