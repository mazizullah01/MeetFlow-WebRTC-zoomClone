import React, { useEffect, useCallback, useRef, useState } from "react";
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/Peer";

const RoomPage = () => {
    const { socket } = useSocket();
    const {
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream,
        remoteStream,
     } = usePeer();

    const [myStream, setMyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState();
    const streamPromiseRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const getUserMediaStream = useCallback(async() => {
        if (!streamPromiseRef.current) {
            streamPromiseRef.current = navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            }).then((stream) => {
                setMyStream(stream);
                return stream;
            });
        }

        return streamPromiseRef.current;
    }, []);

    const handleNewUserJoined = useCallback(async (data) => {
        const {emailId} = data;
        console.log("New user joined room", emailId);
        setRemoteEmailId(emailId);
        const stream = await getUserMediaStream();
        await sendStream(stream);
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
    }, [createOffer, getUserMediaStream, sendStream, socket]);

    const handleIncomingCall = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("Incoming call from", from , offer);
        setRemoteEmailId(from);
        const stream = await getUserMediaStream();
        await sendStream(stream);
        const ans = await createAnswer(offer);
        socket.emit("call-accepted", {emailId: from,  ans });
    }, [createAnswer, getUserMediaStream, sendStream, socket]);

    const handleCallAccepted = useCallback (async(data) => {
        const { ans } = data;
        console.log("Call got accepted", ans);
        await setRemoteAns(ans);
    }, [setRemoteAns]);

    useEffect (() => {
        socket.on("user-joined", handleNewUserJoined)
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted)

    return () =>  {
     socket.off("user-joined", handleNewUserJoined);
     socket.off("incoming-call", handleIncomingCall);
    socket.off("call-accepted", handleCallAccepted);
    }; 

    }, [handleNewUserJoined, handleIncomingCall, handleCallAccepted, socket]);

    useEffect(() => {
    getUserMediaStream(); 
    }, [getUserMediaStream]);

    useEffect(() => {
        if (localVideoRef.current && localVideoRef.current.srcObject !== myStream) {
            localVideoRef.current.srcObject = myStream;
        }
    }, [myStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return(
        <div className="room-page-container">
         <h1>Room Page</h1>
         <h4> You are connected to {remoteEmailId}</h4>
<button
  disabled={!myStream}
  onClick={() => sendStream(myStream)}
>
  Send my video
</button>

         <video
           autoPlay
           muted
           playsInline
           ref={localVideoRef}
        style={{ width: "600px", height: "400px" }}
    />
    <video
      autoPlay
      playsInline
      ref={remoteVideoRef}
      style={{ width: "600px", height: "400px" }}
    />
    </div>
    );
};

export default RoomPage;
