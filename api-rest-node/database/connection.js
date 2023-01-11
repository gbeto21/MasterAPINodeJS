const mongoose = require("mongoose")

const connection = async ()=>{
  try {
    await mongoose.connect("mongodb://localhost:27017/blogs_node")
    console.log("Conected to the database");
  } catch (error) {
    console.error("Error accesing to database: ", error);
  }
} 

module.exports = {
  connection
}