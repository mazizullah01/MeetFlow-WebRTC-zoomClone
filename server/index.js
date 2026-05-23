const express = require("express");
const bodyParser = require("body-parrser");
const {Server} = require ("socket.io");

const io = new Server(); 
const app = express();

app.use(bodyParser.json());

io.on("connection", socket => {
    socket.on("join-room", (data) => {
        const { roomId, emailId } = data;
        console.log("User", emailId, "Joined Room", roomId);
        emailToSoketMapping.set(emailId, socket.id);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-joined", { emailId })
    });
});

app.listen(4000,  () => console.log("Http server running at PORT 4000"));
io.listen(4001);