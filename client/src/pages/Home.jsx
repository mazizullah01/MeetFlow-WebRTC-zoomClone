import React, { useState } from "react";
import { useSocket } from "../providers/socket"

const HomePage = () => {
    const { socket } = useSocket();

    const [email, setEmail] = useState();
    const [roomId, setRoomId] = useState();

    const handleJoinRoom = () => {
        socket.emit("join-room", { emailId: email, roomId });
    }
    return (
        <div className="homepage-container">
            <div className="input-container">
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter your email here" />
                <input value={roomId} onChange={e => setRoomId(e.target.value)} type="text" placeholder="Enter your Room code" />
                <button onClick={handleJoinRoom}>Enter Room</button>
             </div>
        </div>
    )
}

export default HomePage;