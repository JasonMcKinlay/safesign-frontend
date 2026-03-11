'use client';

import { useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [translation, setTranslation] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }, // Front camera for ASL
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <span>Camera Off</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          {!isCameraOn ? (
            <button
              onClick={startCamera}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Stop Camera
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
