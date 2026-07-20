import React, { useState } from "react";
import "./MeetingHeader.css";

const MeetingHeader = ({ roomId, isConnected }) => {
    const [copied, setCopied] = useState(false);

    const copyRoomId = async () => {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <header className="meeting-header">
            <div className="meeting-brand"><span>M</span> MeetFlow</div>
            <div className="meeting-status">
                <span className={`status-dot ${isConnected ? "online" : ""}`} />
                {isConnected ? "Connected" : "Waiting"}
            </div>
            <button className="room-code" onClick={copyRoomId} title="Copy room code">
                <span>Room&nbsp; {roomId}</span>
                <strong>{copied ? "Copied!" : "Copy"}</strong>
            </button>
        </header>
    );
};

export default MeetingHeader;
