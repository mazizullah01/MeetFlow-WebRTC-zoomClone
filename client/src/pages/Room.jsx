import React, { useEffect, useCallback, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/Peer";
import MeetingHeader from "../components/MeetingHeader";
import VideoTile from "../components/VideoTile";
import CallControls from "../components/CallControls";
import "./Room.css";

const RoomPage = () => {
    const { socket } = useSocket();
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream,
        remoteStream,
        addIceCandidate,
     } = usePeer();

    const [myStream, setMyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const streamPromiseRef = useRef(null);
    const remoteEmailRef = useRef(null);
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
        remoteEmailRef.current = emailId;
        const stream = await getUserMediaStream();
        await sendStream(stream);
        const offer = await createOffer();
        socket.emit("call-user", { emailId, offer });
    }, [createOffer, getUserMediaStream, sendStream, socket]);

    const handleIncomingCall = useCallback(async (data) => {
        const { from, offer } = data;
        console.log("Incoming call from", from , offer);
        setRemoteEmailId(from);
        remoteEmailRef.current = from;
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

    const handleIncomingIceCandidate = useCallback(async ({ candidate }) => {
        await addIceCandidate(candidate);
    }, [addIceCandidate]);

    useEffect (() => {
        socket.on("user-joined", handleNewUserJoined)
        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-accepted", handleCallAccepted)
        socket.on("incoming-ice-candidate", handleIncomingIceCandidate);

    return () =>  {
     socket.off("user-joined", handleNewUserJoined);
     socket.off("incoming-call", handleIncomingCall);
    socket.off("call-accepted", handleCallAccepted);
    socket.off("incoming-ice-candidate", handleIncomingIceCandidate);
    }; 

    }, [handleNewUserJoined, handleIncomingCall, handleCallAccepted, handleIncomingIceCandidate, socket]);

    useEffect(() => {
        const handleIceCandidate = ({ candidate }) => {
            if (candidate && remoteEmailRef.current) {
                socket.emit("ice-candidate", {
                    emailId: remoteEmailRef.current,
                    candidate,
                });
            }
        };

        peer.addEventListener("icecandidate", handleIceCandidate);
        return () => peer.removeEventListener("icecandidate", handleIceCandidate);
    }, [peer, socket]);

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

    const toggleTrack = (kind, enabled, setEnabled) => {
        myStream?.getTracks().filter(track => track.kind === kind).forEach(track => {
            track.enabled = !enabled;
        });
        setEnabled(!enabled);
    };

    const leaveMeeting = () => {
        myStream?.getTracks().forEach(track => track.stop());
        navigate("/");
    };

    return(
        <div className="room-page-container">
            <MeetingHeader roomId={roomId} isConnected={Boolean(remoteEmailId)} />
            <main className="meeting-stage">
                <div className="video-grid">
                    <VideoTile
                        videoRef={localVideoRef}
                        muted
                        label={location.state?.email || "You"}
                        isCameraOn={isCameraOn}
                        badge="You"
                    />
                    <VideoTile
                        videoRef={remoteVideoRef}
                        label={remoteEmailId || "Waiting for someone to join"}
                        isCameraOn={Boolean(remoteStream)}
                        isWaiting={!remoteStream}
                    />
                </div>
            </main>
            <CallControls
                isMicOn={isMicOn}
                isCameraOn={isCameraOn}
                disabled={!myStream}
                onToggleMic={() => toggleTrack("audio", isMicOn, setIsMicOn)}
                onToggleCamera={() => toggleTrack("video", isCameraOn, setIsCameraOn)}
                onLeave={leaveMeeting}
            />
        </div>
    );
};

export default RoomPage;
