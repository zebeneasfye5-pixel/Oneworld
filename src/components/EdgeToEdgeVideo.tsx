import React, { useEffect, useRef, useState, useCallback } from 'react';

interface EdgeToEdgeVideoProps {
  stream: MediaStream | null | undefined;
  muted?: boolean;
  mirror?: boolean;
  zoom?: number;
  className?: string;
}

/**
 * EdgeToEdgeVideo (IMO / TikTok style full-bleed renderer + custom zoom 0.3x - 2.5x)
 * Eliminates black letterboxing/pillarboxing at zoom >= 1 while letting users smoothly
 * zoom out (< 1.0 down to 0.3x) or zoom in (> 1.0 up to 2.5x) inside fullscreen.
 */
export const EdgeToEdgeVideo: React.FC<EdgeToEdgeVideoProps> = ({
  stream,
  muted = false,
  mirror = false,
  zoom = 1,
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
      const coverScale = Math.max(cW / vW, cH / vH);
      setBoxSize({
        w: Math.ceil(vW * coverScale) + 2,
        h: Math.ceil(vH * coverScale) + 2,
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

  const clampedZoom = Math.max(0.3, Math.min(2.5, zoom));
  const scaleTransform = `scale(${clampedZoom})`;
  const mirrorTransform = mirror ? 'scaleX(-1)' : '';
  const centeredTransform = ['translate(-50%, -50%)', scaleTransform, mirrorTransform].filter(Boolean).join(' ');
  const fallbackTransform = [scaleTransform, mirrorTransform].filter(Boolean).join(' ');

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
        transformOrigin: 'center center',
        transition: 'transform 200ms ease-out',
        transform: centeredTransform,
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
        transformOrigin: 'center center',
        transition: 'transform 200ms ease-out',
        transform: fallbackTransform,
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
