import React, { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';

interface RemoteAudioPlayerProps {
  stream: MediaStream | undefined | null;
}

/**
 * Dedicated low-latency, stall-resistant remote peer audio player.
 * - Avoids re-binding srcObject when only video tracks change (prevents audio dropouts).
 * - Automatically resumes if mobile OS / WebView pauses or stalls audio.
 * - Ducks volume smoothly while a translated voice dubbing utterance is playing.
 */
export const RemoteAudioPlayer: React.FC<RemoteAudioPlayerProps> = ({ stream }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioSigRef = useRef<string>('');
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !stream) return;

    const getAudioSignature = (s: MediaStream) =>
      s
        .getAudioTracks()
        .map((t) => t.id)
        .sort()
        .join(',');

    const tryPlay = () => {
      const target = audioRef.current;
      if (!target || !stream) return;

      const sig = getAudioSignature(stream);
      if (target.srcObject !== stream && (!sig || sig !== lastAudioSigRef.current || !target.srcObject)) {
        lastAudioSigRef.current = sig;
        target.srcObject = stream;
      }

      if (target.paused) {
        const playPromise = target.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise
            .then(() => setAutoplayBlocked(false))
            .catch(() => setAutoplayBlocked(true));
        }
      }
    };

    const handleGestureUnlock = () => {
      const target = audioRef.current;
      if (!target) return;
      if (autoplayBlocked || target.paused) {
        target
          .play()
          .then(() => setAutoplayBlocked(false))
          .catch(() => {});
      }
    };

    const handleDubbingState = (ev: Event) => {
      const target = audioRef.current;
      if (!target) return;
      const custom = ev as CustomEvent<{ active: boolean }>;
      target.volume = custom.detail?.active ? 0.15 : 1.0;
    };

    const handleTrackAdd = (ev: MediaStreamTrackEvent) => {
      if (ev.track.kind === 'audio') {
        lastAudioSigRef.current = '';
        tryPlay();
      }
    };

    tryPlay();
    stream.addEventListener('addtrack', handleTrackAdd);
    window.addEventListener('pointerdown', handleGestureUnlock, { passive: true });
    window.addEventListener('touchstart', handleGestureUnlock, { passive: true });
    window.addEventListener('click', handleGestureUnlock, { passive: true });
    window.addEventListener('oneworld:dubbing-state', handleDubbingState as EventListener);

    return () => {
      stream.removeEventListener('addtrack', handleTrackAdd);
      window.removeEventListener('pointerdown', handleGestureUnlock);
      window.removeEventListener('touchstart', handleGestureUnlock);
      window.removeEventListener('click', handleGestureUnlock);
      window.removeEventListener('oneworld:dubbing-state', handleDubbingState as EventListener);
    };
  }, [stream, autoplayBlocked]);

  if (!stream) return null;

  return (
    <>
      <audio
        ref={audioRef}
        autoPlay
        playsInline
        onPause={() => {
          const el = audioRef.current;
          if (el && stream.getAudioTracks().some((t) => t.readyState === 'live')) {
            el.play().catch(() => {});
          }
        }}
        className="hidden"
      />
      {autoplayBlocked && (
        <button
          type="button"
          onClick={() => {
            audioRef.current
              ?.play()
              .then(() => setAutoplayBlocked(false))
              .catch(() => {});
          }}
          className="fixed bottom-20 left-4 z-50 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-1.5 cursor-pointer animate-pulse"
        >
          <Volume2 className="w-4 h-4" />
          <span>ድምፅ ክፈት (Tap to Unmute Audio)</span>
        </button>
      )}
    </>
  );
};
