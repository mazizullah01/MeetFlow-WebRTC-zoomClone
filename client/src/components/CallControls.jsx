import React from "react";
import "./CallControls.css";

const CallControls = ({ isMicOn, isCameraOn, disabled, onToggleMic, onToggleCamera, onLeave }) => (
    <footer className="call-controls-wrap">
        <div className="call-controls">
            <button disabled={disabled} className={!isMicOn ? "control-off" : ""} onClick={onToggleMic} title="Toggle microphone">
                <span>{isMicOn ? "🎙" : "🔇"}</span>
                <small>{isMicOn ? "Mute" : "Unmute"}</small>
            </button>
            <button disabled={disabled} className={!isCameraOn ? "control-off" : ""} onClick={onToggleCamera} title="Toggle camera">
                <span>{isCameraOn ? "▣" : "▧"}</span>
                <small>{isCameraOn ? "Camera" : "Start video"}</small>
            </button>
            <button className="leave-button" onClick={onLeave} title="Leave meeting">
                <span>↗</span>
                <small>Leave</small>
            </button>
        </div>
    </footer>
);

export default CallControls;
