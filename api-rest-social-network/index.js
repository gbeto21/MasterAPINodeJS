const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");

const PORT = 3900;
const app = express();

const routerFollow = require("./routes/follow");
const routerUser = require("./routes/user");
const routerPublication = require("./routes/publication");

connection();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/follow", routerFollow);
app.use("/users", routerUser);
app.use("/publications", routerPublication);

app.listen(PORT, () => {
  console.log(`✅ Server listen at port: ${PORT}`);
});
