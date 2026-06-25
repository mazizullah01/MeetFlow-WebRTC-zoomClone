import React, { useEffect, useCallback } from "react";
import { useSocket } from "../providers/socket";
import { Socket } from "socket.io-client";
import { usePeer } from "../providers/Peer";

const RoomPage = () => {
    const { socket } = useSocket();
    const { peer, createOffer } = usePeer();

    const HandleNewUserJoined = useCallback(async (data) => {
        const {emailId} = data
        console.log("new user joined room", emailId);
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
    }, [ createOffer, socket]);

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