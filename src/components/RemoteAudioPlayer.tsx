import React, { useEffect, useRef } from 'react';

interface RemoteAudioPlayerProps {
  stream: MediaStream | undefined | null;
}

/**
 * Dedicated low-latency remote peer audio player.
 * Re-binds on addtrack events and automatically unlocks playback on first user touch/click
 * if mobile Safari/Chrome/WebView blocked autoplay prior to interaction.
 */
export const RemoteAudioPlayer: React.FC<RemoteAudioPlayerProps> = ({ stream }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !stream) return;

    let blocked = false;

    const tryPlay = () => {
      if (!audioRef.current) return;
      if (audioRef.current.srcObject !== stream) {
        audioRef.current.srcObject = stream;
      }
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          blocked = true;
        });
      }
    };

    const handleGestureUnlock = () => {
      if (blocked && audioRef.current) {
        blocked = false;
        audioRef.current.play().catch(() => {});
      }
    };

    tryPlay();
    stream.addEventListener('addtrack', tryPlay);
    window.addEventListener('pointerdown', handleGestureUnlock, { passive: true });
    window.addEventListener('touchstart', handleGestureUnlock, { passive: true });
    window.addEventListener('click', handleGestureUnlock, { passive: true });

    return () => {
      stream.removeEventListener('addtrack', tryPlay);
      window.removeEventListener('pointerdown', handleGestureUnlock);
      window.removeEventListener('touchstart', handleGestureUnlock);
      window.removeEventListener('click', handleGestureUnlock);
    };
  }, [stream]);

  if (!stream) return null;

  return <audio ref={audioRef} autoPlay playsInline className="hidden" />;
};
