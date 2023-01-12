const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

const PORT = 3900;
const app = express();

connection();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`✅ Server listen at port: ${PORT}`);
});
