import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from './context/SocketContext';
import useMediaStream from './hooks/useMediaStream';
import SimplePeer from 'simple-peer';
import CallModal from './components/CallModel/CallModel';
import CallWindow from './components/CallWindow/CallWindow';
import './App.css';

function App() {
  const socket = useSocket();
  const { stream } = useMediaStream();
  const [callFrom, setCallFrom] = useState('');
  const [incomingCall, setIncomingCall] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerRef = useRef();

  useEffect(() => {
    if (!socket) return;

    socket.on('call', ({ from }) => {
      setCallFrom(from);
      setIncomingCall(true);
    });

    socket.on('callAccepted', ({ signal }) => {
      setCallActive(true);
      peerRef.current.signal(signal);
    });

    socket.on('callRejected', () => {
      setIncomingCall(false);
      alert('Call rejected');
    });

    socket.on('callEnded', () => {
      endCall();
    });

    socket.on('signal', ({ signal }) => {
      peerRef.current.signal(signal);
    });

    return () => {
      socket.off('call');
      socket.off('callAccepted');
      socket.off('callRejected');
      socket.off('callEnded');
      socket.off('signal');
    };
  }, [socket]);

  const startCall = (isInitiator, targetID) => {
    setIncomingCall(false);
    setCallActive(true);

    const peer = new SimplePeer({
      initiator: isInitiator,
      stream: stream,
      trickle: false
    });

    peer.on('signal', (data) => {
      if (isInitiator) {
        socket.emit('callUser', { userToCall: targetID, signalData: data, from: socket.id });
      } else {
        socket.emit('acceptCall', { signal: data, to: callFrom });
      }
    });

    peer.on('stream', (remoteStream) => {
      setRemoteStream(remoteStream);
    });

    peer.on('close', () => {
      endCall();
    });

    peerRef.current = peer;
  };

  const rejectCall = () => {
    socket.emit('rejectCall', { to: callFrom });
    setIncomingCall(false);
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setCallActive(false);
    setRemoteStream(null);
    socket.emit('endCall', { to: callFrom });
  };

  return (
    <div className="app">
      {!callActive && !incomingCall && (
        <div className="home-screen">
          <h1>Video Chat App</h1>
          <button onClick={() => startCall(true, prompt('Enter user ID to call'))}>
            Start Call
          </button>
        </div>
      )}

      {incomingCall && (
        <CallModal
          callFrom={callFrom}
          startCall={() => startCall(false)}
          rejectCall={rejectCall}
        />
      )}

      {callActive && (
        <CallWindow
          callFrom={callFrom}
          startCall={startCall}
          localStream={stream}
          remoteStream={remoteStream}
          rejectCall={endCall}
        />
      )}
    </div>
  );
}

export default App;