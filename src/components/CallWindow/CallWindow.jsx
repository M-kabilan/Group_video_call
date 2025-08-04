import React, { useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import { FaPhoneSlash, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
// import './CallWindow.css';

export default function CallWindow({ callFrom, startCall, localStream, remoteStream, rejectCall }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="call-window">
      <div className="video-container">
        {remoteStream && (
          <div className="remote-video">
            <VideoPlayer stream={remoteStream} isMuted={false} />
          </div>
        )}
        {localStream && (
          <div className="local-video">
            <VideoPlayer stream={localStream} isMuted={true} />
          </div>
        )}
      </div>
      <div className="call-controls">
        <button onClick={toggleMute}>
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button onClick={toggleVideo}>
          {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>
        <button className="end-call" onClick={rejectCall}>
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
}