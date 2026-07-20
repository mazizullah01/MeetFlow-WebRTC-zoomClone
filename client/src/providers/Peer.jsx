import React, { useMemo, useEffect, useRef, useState, useCallback } from "react";
  
const PeerContext  = React.createContext(null);
 
export const usePeer =() => React.useContext(PeerContext);

export const PeerProvider = (props) => {
    const [remoteStream, setRemoteStream] = useState(null);
    const pendingCandidates = useRef([]);
    const peer = useMemo (() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:global.stun.twilio.com:3478",
                ],
            },
        ],
    }),
  []
);

const applyPendingCandidates = async () => {
    for (const candidate of pendingCandidates.current) {
        await peer.addIceCandidate(candidate);
    }
    pendingCandidates.current = [];
};

const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return peer.localDescription;
}

const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    await applyPendingCandidates();
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return peer.localDescription;
}

const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(ans);
    await applyPendingCandidates();
};

const addIceCandidate = async (candidate) => {
    if (peer.remoteDescription) {
        await peer.addIceCandidate(candidate);
    } else {
        pendingCandidates.current.push(candidate);
    }
};

const sendStream = async (stream) => {
    const tracks =  stream.getTracks();
    for (const track of tracks) {
        const isTrackAlreadyAdded = peer
            .getSenders()
            .some((sender) => sender.track === track);

        if (!isTrackAlreadyAdded) {
            peer.addTrack(track, stream);
        }
    };  
};

const handleTrackEvent = useCallback((ev) => {
  const stream = ev.streams[0];
  setRemoteStream(stream);
}, []);

useEffect(() => {
  peer.addEventListener("track", handleTrackEvent);

  return () => {
    peer.removeEventListener("track", handleTrackEvent);
  };
}, [handleTrackEvent, peer]);

return(
    <PeerContext.Provider 
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream, 
        addIceCandidate,
        remoteStream,
     }}
    >
    {props.children}
    </PeerContext.Provider>
    );
};
