import React, { useEffect, useRef } from 'react';
// import './VideoPlayer.css';

export default function VideoPlayer({ stream, isMuted }) {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        playsInline
      />
    </div>
  );
}