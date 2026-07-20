import React from "react";
import "./VideoTile.css";

const VideoTile = ({ videoRef, muted = false, label, badge, isCameraOn, isWaiting }) => (
    <section className="video-tile">
        <video ref={videoRef} autoPlay muted={muted} playsInline />
        {!isCameraOn && (
            <div className="video-placeholder">
                <div className={isWaiting ? "waiting-avatar" : "user-avatar"}>
                    {isWaiting ? <span className="waiting-pulse" /> : label?.charAt(0).toUpperCase()}
                </div>
                <p>{isWaiting ? "Share the room code to invite someone" : "Camera is off"}</p>
            </div>
        )}
        <div className="participant-label">
            <span>{label}</span>
            {badge && <small>{badge}</small>}
        </div>
    </section>
);

export default VideoTile;
