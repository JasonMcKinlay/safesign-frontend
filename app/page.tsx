'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    let mounted = true;
    const startCamera = async () => {
      try {
        if (videoRef.current && videoRef.current.srcObject) {
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });

        if (mounted && videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraError('Unable to access camera. Please check permissions.');
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/100" />

        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">SafeSign Beta</p>
            <h1 className="text-xl font-bold">Live ASL Translator</h1>
          </div>
          <div className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">Live</div>
        </header>

        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-red-300">
            <div className="rounded-xl bg-black/60 px-4 py-3">{cameraError}</div>
          </div>
        ) : null}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-end mb-4">
            <button
            onClick={() => setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))}
            aria-label="Toggle camera"
            className="h-12 w-12 rounded-full bg-white/20 text-white shadow-xl ring-1 ring-white/30 backdrop-blur hover:bg-white/30 flex items-center justify-center"
            >
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.8839 9.38388C22.372 8.89573 22.372 8.10427 21.8839 7.61612C21.3957 7.12796 20.6043 7.12796 20.1161 7.61612L21.8839 9.38388ZM18 11.5L17.1161 12.3839C17.3505 12.6183 17.6685 12.75 18 12.75C18.3315 12.75 18.6495 12.6183 18.8839 12.3839L18 11.5ZM15.8839 7.61612C15.3957 7.12796 14.6043 7.12796 14.1161 7.61612C13.628 8.10427 13.628 8.89573 14.1161 9.38388L15.8839 7.61612ZM4.75 8.5C4.75 9.19036 5.30964 9.75 6 9.75C6.69036 9.75 7.25 9.19036 7.25 8.5L4.75 8.5ZM18 5.5L19.25 5.5L18 5.5ZM20.1161 7.61612L17.1161 10.6161L18.8839 12.3839L21.8839 9.38388L20.1161 7.61612ZM18.8839 10.6161L15.8839 7.61612L14.1161 9.38388L17.1161 12.3839L18.8839 10.6161ZM19.25 11.5L19.25 5.5L16.75 5.5L16.75 11.5L19.25 11.5ZM17 3.25L7 3.25L7 5.75L17 5.75L17 3.25ZM4.75 5.5L4.75 8.5L7.25 8.5L7.25 5.5L4.75 5.5ZM7 3.25C5.75736 3.25 4.75 4.25736 4.75 5.5L7.25 5.5C7.25 5.63807 7.13807 5.75 7 5.75L7 3.25ZM19.25 5.5C19.25 4.25736 18.2426 3.25 17 3.25L17 5.75C16.8619 5.75 16.75 5.63807 16.75 5.5L19.25 5.5Z" fill="#ffffff"/>
              <path d="M3 15.5L6 12.5M6 12.5L9 15.5M6 12.5V18.5C6 19.0523 6.44772 19.5 7 19.5H17C17.5523 19.5 18 19.0523 18 18.5V15.5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="rounded-xl bg-white/20 px-3 py-8 my-2 text-sm font-light text-white/50 hover:bg-white/30">Start signing...</div>
          <div className="mb-6 text-center text-sm text-slate-200/90">Point your camera at ASL gestures to begin translation.</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button className="rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/30">Chat Log</button>
            <button className="rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/30">Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
