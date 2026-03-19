'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showChatLog, setShowChatLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [textSize, setTextSize] = useState(14);
  const [translationHistory, setTranslationHistory] = useState<string[]>([
    'Voice: What is the emergency?',
    'ASL: Hi officer, I am deaf by the way. There has been a car accident on 5th and Main.',
    'Voice: Are there any injuries?',
    'ASL: Yes, there are two people injured and they need medical assistance.',
    'Voice: Ok, help is on the way. Can you tell me more about the accident?',
    'ASL: It looks like a red sedan ran a red light and hit a blue SUV. The sedan is smoking and the driver is unconscious.',
    'Voice: Thank you for the information. Stay here until help arrives.',
    'ASL: Will do, thank you officer.',
  ]);
  const latestMessage = translationHistory[translationHistory.length - 1] || 'ASL: No translation yet.';
  const splitSpeaker = (message: string) => {
    const [speaker, ...rest] = message.split(':');
    return { speaker: speaker?.trim(), text: rest.join(':').trim() };
  };

  const speakText = (message: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

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
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="relative h-screen w-full overflow-hidden touch-none">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 h-full w-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/5 to-black/75" />

        <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/safesign-logo.png" alt="SafeSign Logo" className="h-8 mb-1 pl-2" />
            <p className="text-sm uppercase tracking-[0.2em] text-slate-200">SafeSign</p>
          </div>
          <button
            onClick={() => {
              setShowSettings(true);
              setTimeout(() => setSettingsVisible(true), 20);
            }}
            aria-label="Open settings"
            className="h-10 w-10 rounded-full flex items-center justify-center active:scale-75 transition"
          >
            <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="#ffffff"/>
            </svg>
          </button>
        </header>

        {showSettings ? (
          <div className={`fixed inset-0 z-40 flex items-end justify-center p-4 md:items-center md:p-8 transition-all duration-300 ${settingsVisible ? 'bg-black/40' : 'bg-transparent pointer-events-none'}`}>
            <div className={`w-full max-w-md rounded-2xl bg-white/20 p-4 ring-1 ring-white/20 backdrop-blur-lg mb-2 transform transition-all duration-300 ${settingsVisible ? 'translate-y-0 opacity-100' : 'translate-y-14 opacity-0'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Settings</p>
                  <h2 className="text-lg font-bold text-white">Main Controls</h2>
                </div>
                <button
                  onClick={() => {
                    setSettingsVisible(false);
                    setTimeout(() => setShowSettings(false), 220);
                  }}
                  className="rounded-full bg-white/10 px-3 py-2 text-white active:bg-white/20 transition"
                  aria-label="Close settings"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 space-y-4 text-sm text-white/90">
                <div className="rounded-xl bg-white/10 ring-1 ring-white/20 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.15em] text-slate-300">Text Size</div>
                  <input
                    type="range"
                    min={12}
                    max={24}
                    value={textSize}
                    onChange={e => setTextSize(Number(e.target.value))}
                    className="w-full accent-sky-400"
                  />
                  <div className="mt-1 text-xs text-slate-300">{textSize}px</div>
                </div>
                <div className="rounded-xl bg-white/10 ring-1 ring-white/20 p-3">
                  <p className="mb-2 text-xs uppercase tracking-[0.15em] text-slate-300">Translation Log</p>
                  <button
                    onClick={() => {
                      setTranslationHistory([]);
                      setShowChatLog(false);
                    }}
                    className="rounded-lg bg-sky-400/80 active:bg-sky-600/60 px-3 py-2 text-xs font-semibold text-white transition"
                  >
                    Clear Chat Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

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
            className="h-12 w-12 rounded-full bg-white/20 text-white shadow-xl ring-1 ring-white/30 backdrop-blur-xs flex items-center justify-center active:bg-white/40 active:ring-0 transition"
            >
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.8839 9.38388C22.372 8.89573 22.372 8.10427 21.8839 7.61612C21.3957 7.12796 20.6043 7.12796 20.1161 7.61612L21.8839 9.38388ZM18 11.5L17.1161 12.3839C17.3505 12.6183 17.6685 12.75 18 12.75C18.3315 12.75 18.6495 12.6183 18.8839 12.3839L18 11.5ZM15.8839 7.61612C15.3957 7.12796 14.6043 7.12796 14.1161 7.61612C13.628 8.10427 13.628 8.89573 14.1161 9.38388L15.8839 7.61612ZM4.75 8.5C4.75 9.19036 5.30964 9.75 6 9.75C6.69036 9.75 7.25 9.19036 7.25 8.5L4.75 8.5ZM18 5.5L19.25 5.5L18 5.5ZM20.1161 7.61612L17.1161 10.6161L18.8839 12.3839L21.8839 9.38388L20.1161 7.61612ZM18.8839 10.6161L15.8839 7.61612L14.1161 9.38388L17.1161 12.3839L18.8839 10.6161ZM19.25 11.5L19.25 5.5L16.75 5.5L16.75 11.5L19.25 11.5ZM17 3.25L7 3.25L7 5.75L17 5.75L17 3.25ZM4.75 5.5L4.75 8.5L7.25 8.5L7.25 5.5L4.75 5.5ZM7 3.25C5.75736 3.25 4.75 4.25736 4.75 5.5L7.25 5.5C7.25 5.63807 7.13807 5.75 7 5.75L7 3.25ZM19.25 5.5C19.25 4.25736 18.2426 3.25 17 3.25L17 5.75C16.8619 5.75 16.75 5.63807 16.75 5.5L19.25 5.5Z" fill="#ffffff"/>
              <path d="M3 15.5L6 12.5M6 12.5L9 15.5M6 12.5V18.5C6 19.0523 6.44772 19.5 7 19.5H17C17.5523 19.5 18 19.0523 18 18.5V15.5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div
            className={`relative ring-2 ring-white/25 rounded-xl bg-white/20 px-3 pb-3 pt-2 my-2 text-sm font-light text-white/90 transition-all duration-300 ease-in-out ${showChatLog ? 'h-80 overflow-auto backdrop-blur-md' : 'h-16 overflow-hidden backdrop-blur-xs'}`}
            id="translation-bubble"
          >
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16" />
            {showChatLog ? (
              <div className="text-left text-sm text-slate-100 px-4 py-3" style={{ lineHeight: 1.35 + textSize / 40 }}>
                {translationHistory.map((msg, idx) => {
                  const parsed = splitSpeaker(msg);
                  return (
                    <div
                      key={idx}
                      className="text-slate-100"
                      style={{
                        fontSize: `${textSize}px`,
                        marginBottom: `${Math.round(textSize * 1)}px`,
                        lineHeight: 1 + textSize / 40,
                      }}
                    >
                      <span className="font-semibold text-white">{parsed.speaker}:</span>{' '}
                      <span>{parsed.text}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-white/90" style={{ fontSize: `${textSize}px`, lineHeight: 1.35 + textSize / 40 }}>
                {(() => {
                  const parsed = splitSpeaker(latestMessage);
                  return (
                    <div className="text-slate-100">
                      <span className="font-semibold">{parsed.speaker}: </span>{' '}
                      <span>{parsed.text}</span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <div className="mb-6 text-center text-sm text-white/30">Point your camera at ASL gestures to begin translation.</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setShowChatLog(prev => !prev)}
              className="rounded-xl bg-white/20 ring-2 ring-white/25 backdrop-blur-xs py-2 text-sm font-black text-white active:bg-white/40 active:ring-0 transition"
            >
              {showChatLog ? 'Minimize' : 'Chat Log'}
            </button>
            {/* <button className="rounded-xl bg-white/20 ring-2 ring-white/25 backdrop-blur-xs py-2 text-sm font-black text-white active:bg-white/40 active:ring-0 transition">Settings</button> */}
            <button
              onClick={() => speakText(splitSpeaker(latestMessage).text)}
              className="rounded-xl bg-white/20 ring-2 ring-white/25 backdrop-blur-xs py-2 text-sm font-black text-white active:bg-white/40 active:ring-0 transition"
            >
              Text-To-Speech
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
