'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    let mounted = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/75" />

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
          <div className="mb-2 text-center text-sm text-slate-200/90">Point your camera at ASL gestures to begin translation.</div>
          <div className="grid grid-cols-3 gap-2">
            <button className="rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/30">Translate</button>
            <button className="rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/30">History</button>
            <button className="rounded-xl bg-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/30">Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
