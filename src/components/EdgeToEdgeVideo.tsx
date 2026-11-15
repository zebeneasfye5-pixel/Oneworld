import React, { useEffect, useRef, useState, useCallback } from 'react';

interface EdgeToEdgeVideoProps {
  stream: MediaStream | null | undefined;
  muted?: boolean;
  mirror?: boolean;
  className?: string;
}

/**
 * EdgeToEdgeVideo (IMO / TikTok style full-bleed renderer)
 * Eliminates black letterboxing/pillarboxing even on Android Chrome & WebView
 * hardware-composited MediaStream surfaces by computing exact cover pixel
 * dimensions against the container box and native videoWidth/videoHeight.
 */
export const EdgeToEdgeVideo: React.FC<EdgeToEdgeVideoProps> = ({
  stream,
  muted = false,
  mirror = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [boxSize, setBoxSize] = useState<{ w: number; h: number } | null>(null);

  const recalculateCover = useCallback(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const cW = container.clientWidth;
    const cH = container.clientHeight;
    if (!cW || !cH) return;

    const vW = video.videoWidth;
    const vH = video.videoHeight;

    if (vW > 0 && vH > 0) {
      const scale = Math.max(cW / vW, cH / vH);
      setBoxSize({
        w: Math.ceil(vW * scale) + 2,
        h: Math.ceil(vH * scale) + 2,
      });
    } else {
      setBoxSize(null);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    video.muted = muted;
    video.playsInline = true;
    video.play().catch(() => {});
    recalculateCover();
  }, [stream, muted, recalculateCover]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    recalculateCover();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        recalculateCover();
      });
      ro.observe(container);
    }

    window.addEventListener('resize', recalculateCover);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', recalculateCover);
    };
  }, [recalculateCover]);

  const videoStyle: React.CSSProperties = boxSize
    ? {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${boxSize.w}px`,
        height: `${boxSize.h}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        objectFit: 'cover',
        objectPosition: 'center center',
        display: 'block',
        transform: mirror
          ? 'translate(-50%, -50%) scaleX(-1)'
          : 'translate(-50%, -50%)',
      }
    : {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        maxHeight: 'none',
        objectFit: 'cover',
        objectPosition: 'center center',
        display: 'block',
        transform: mirror ? 'scaleX(-1)' : undefined,
      };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black ${className}`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        onLoadedMetadata={recalculateCover}
        onResize={recalculateCover}
        onPlaying={recalculateCover}
        style={videoStyle}
      />
    </div>
  );
};
