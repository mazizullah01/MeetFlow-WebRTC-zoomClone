import React from "react";
  
const PeerContext  = React.createContext(null);
 
export const PeerProvider = (props) => {
    const peer = useMemo (() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.google.com:19302",
                    "stun:  global.stun.twilio.com:3478",
                ],
            },
        ],
    }),
  []
);
const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
}

    return(
    <PeerContext.Provider value={{ peer, createOffer}}>
    {props.children}
    </PeerContext.Provider>
    );
};