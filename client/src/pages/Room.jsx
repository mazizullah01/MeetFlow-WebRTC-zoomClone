import React, { useEffect } from "react";
import { useSocket } from "../providers/socket";
import { Socket } from "socket.io-client";

const RoomPage = () => {
    const { socket } = useSocket();

    const HandleNewUserJoined = (data) => {
        const {emailId} = data
        console.log("new user joined room", emailId);

    }

    useEffect (() => {
        socket.on("user-joined", HandleNewUserJoined)
    }, [socket]);

    return(
        <div className="room-page-container">
         <h1>Room Page</h1>
        </div>
    );
};

export default RoomPage;