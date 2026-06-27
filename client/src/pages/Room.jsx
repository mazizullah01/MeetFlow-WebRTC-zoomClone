import React, { useEffect, useCallback } from "react";
import { useSocket } from "../providers/socket";
import { Socket } from "socket.io-client";
import { usePeer } from "../providers/Peer";

const RoomPage = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer } = usePeer();

    const HandleNewUserJoined = useCallback(async (data) => {
        const {emailId} = data
        console.log("new user joined room", emailId);
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
    }, [ createOffer, socket]);

    const handleIncomingCall = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("Incoming call from", from , offer);
        const ans = await createAnswer(offer);
        socket.emit("call-accepted", {emailId: from,  ans });
    }, [createAnswer, socket]);

    useEffect (() => {
        socket.on("user-joined", HandleNewUserJoined)
        socket.on("incoming-call", handleIncomingCall);

        return () =>  {
        socket.off("user-joined", HandleNewUserJoined);
        socket.off("incoming-call", handleIncomingCall);
    }

    }, [handleIncomingCall, HandleNewUserJoined, socket]);

    return(
        <div className="room-page-container">
         <h1>Room Page</h1>
        </div>
    );
};

export default RoomPage;