require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const env = require("./env");
const Routes = require("./router");
const server = express();
connectDB();

server.use((req, res, next)=>{
    console.log("REQUEST::", req.path);
    next()
})
server.use(cors());
server.use(Routes);

const port = process.env.PORT
server.listen(port, ()=>{
    console.log(`YMH459 Server Listenin on ${port}`);
});