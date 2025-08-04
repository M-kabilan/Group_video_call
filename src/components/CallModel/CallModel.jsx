import React from 'react';
import { FaPhone, FaPhoneSlash } from 'react-icons/fa';
// import './CallModal.css';

export default function CallModal({ callFrom, startCall, rejectCall }) {
  return (
    <div className="call-modal">
      <div className="call-modal-content">
        <h2>Incoming Call from {callFrom}</h2>
        <div className="call-modal-buttons">
          <button className="accept-call" onClick={startCall}>
            <FaPhone />
          </button>
          <button className="reject-call" onClick={rejectCall}>
            <FaPhoneSlash />
          </button>
        </div>
      </div>
    </div>
  );
}