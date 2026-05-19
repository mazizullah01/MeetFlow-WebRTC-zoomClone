const express = require("express");
const bodyParser = require("body-parrser");
const {Server} = require ("socket.io");

const io = new Server(); 
const app = express();

app.use(bodyParser.json());

io.on("connection", socket => {});

app.listen(4000,  () => console.log("Http server running at PORT 4000"));
io.listen(4001);