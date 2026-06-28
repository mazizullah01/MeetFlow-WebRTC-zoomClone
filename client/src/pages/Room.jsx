import React, { useEffect, useCallback } from "react";
import { useSocket } from "../providers/socket";
import { Socket } from "socket.io-client";
import { usePeer } from "../providers/Peer";

const RoomPage = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, setRemoteAns } = usePeer();

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

    const handleCallAcepted = useCallback (async(data) => {
        const { ans } = data;
        console.log("call got accepted", ans);
        await setRemoteAns(ans);
    }, [setRemoteAns]);

    useEffect (() => {
        socket.on("user-joined", HandleNewUserJoined)
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAcepted)

        return () =>  {
        socket.off("user-joined", HandleNewUserJoined);
        socket.off("incoming-call", handleIncomingCall);
        socket.off("call-accepted", handleCallAcepted);
    }

    }, [handleIncomingCall, HandleNewUserJoined, handleCallAcepted, socket]);

    return(
        <div className="room-page-container">
         <h1>Room Page</h1>
        </div>
    );
};

export default RoomPage;