import React, { useMemo, useEffect, useState, useCallback } from "react";
  
const PeerContext  = React.createContext(null);
 
export const usePeer =() => React.useContext(PeerContext);

export const PeerProvider = (props) => {
    const [remoteStream, setRemoteStream] = useState(null);
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

const waitForIceGathering = () => {
    if (peer.iceGatheringState === "complete") return Promise.resolve();

    return new Promise((resolve) => {
        const handleStateChange = () => {
            if (peer.iceGatheringState === "complete") {
                peer.removeEventListener("icegatheringstatechange", handleStateChange);
                resolve();
            }
        };

        peer.addEventListener("icegatheringstatechange", handleStateChange);
    });
};

const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    await waitForIceGathering();
    return peer.localDescription;
}

const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    await waitForIceGathering();
    return peer.localDescription;
}

const setRemoteAns = async (ans) => {
    await peer.setRemoteDescription(ans);
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
        remoteStream,
     }}
    >
    {props.children}
    </PeerContext.Provider>
    );
};
