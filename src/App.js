import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    if (isCameraOn) {
      startCamera();
    }

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    });
  }, []);

  const toggleCamera = () => {
    setIsCameraOn((prevIsCameraOn) => !prevIsCameraOn);
  };

  const handleInstallButtonClick = () => {
    if(deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ display: isCameraOn ? 'block' : 'none' }} autoPlay playsInline/>
      <div>
        <button onClick={toggleCamera}>
          {isCameraOn ? 'Ugasi kameru' : 'Upali kameru'}
        </button>
      </div>

      <div>
        <button onClick={handleInstallButtonClick}>Instaliraj aplikaciju</button>
      </div>
    </div>
  );
}

export default App;