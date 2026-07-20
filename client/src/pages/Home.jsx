import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../providers/socket"
import "./Home.css";

const HomePage = () => {
    const { socket } = useSocket();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [roomId, setRoomId] = useState("");

    const handleRoomJoined = useCallback(({ roomId }) => {
        navigate(`/room/${roomId}`, { state: { email } });
    }, [email, navigate]);

    useEffect(() => {
        socket.on("joined-room", handleRoomJoined)
        return () => {
            socket.off("joined-room", handleRoomJoined);
        };
    }, [handleRoomJoined,  socket]);

    const handleJoinRoom = (event) => {
        event.preventDefault();
        if (!email.trim() || !roomId.trim()) return;
        socket.emit("join-room", { emailId: email.trim(), roomId: roomId.trim() });
    };

    const createRoomCode = () => {
        setRoomId(Math.random().toString(36).slice(2, 8).toUpperCase());
    };

    return (
        <div className="homepage-container">
            <div className="home-glow home-glow-one" />
            <div className="home-glow home-glow-two" />
            <main className="home-content">
                <section className="home-intro">
                    <div className="brand-mark">M</div>
                    <span className="brand-name">MeetFlow</span>
                    <h1>Meet face-to-face, wherever you are.</h1>
                    <p>Fast, private video meetings with a room code. No downloads and no complicated setup.</p>
                    <div className="feature-list">
                        <span>✓ HD video</span>
                        <span>✓ Peer-to-peer</span>
                        <span>✓ Instant rooms</span>
                    </div>
                </section>

                <form className="join-card" onSubmit={handleJoinRoom}>
                    <div className="join-card-heading">
                        <span className="eyebrow">READY WHEN YOU ARE</span>
                        <h2>Join a meeting</h2>
                        <p>Enter your details to step into the room.</p>
                    </div>
                    <label>
                        Email address
                        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
                    </label>
                    <label>
                        Room code
                        <div className="room-code-field">
                            <input value={roomId} onChange={e => setRoomId(e.target.value)} type="text" placeholder="e.g. TEAM42" required />
                            <button type="button" onClick={createRoomCode}>Create</button>
                        </div>
                    </label>
                    <button className="join-button" type="submit">Join meeting <span>→</span></button>
                    <small>Your call is streamed directly between participants.</small>
                </form>
            </main>
        </div>
    );
};

export default HomePage;
