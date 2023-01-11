const {connection} = require("./database/connection")
const cors = require("cors")
const express = require("express")

const PORT = 3900

const app = express()

app.use(cors())

app.use(express.json())

app.listen(PORT, ()=>{
  console.log(`Server listening at port: ${PORT}`);
  connection()
})