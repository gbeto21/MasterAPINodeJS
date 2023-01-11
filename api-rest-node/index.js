const { connection } = require("./database/connection");
const cors = require("cors");
const express = require("express");
const articleRoute = require("./routes/Article");

const PORT = 3900;

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", articleRoute);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Ok" });
});

app.listen(PORT, () => {
  console.log(`Server listening at port: ${PORT}`);
  connection();
});
