import React, { useEffect, useRef, useState, useCallback } from 'react';

interface EdgeToEdgeVideoProps {
  stream: MediaStream | null | undefined;
  fallbackFrame?: string | null;
  muted?: boolean;
  mirror?: boolean;
  zoom?: number;
  className?: string;
}

/**
 * EdgeToEdgeVideo (IMO / TikTok style full-bleed renderer + custom zoom 0.3x - 2.5x)
 * Eliminates black letterboxing/pillarboxing at zoom >= 1 while supporting both direct WebRTC
 * MediaStreams AND instant Server-Relayed live video frames on restricted mobile networks.
 */
export const EdgeToEdgeVideo: React.FC<EdgeToEdgeVideoProps> = ({
  stream,
  fallbackFrame = null,
  muted = false,
  mirror = false,
  zoom = 1,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [boxSize, setBoxSize] = useState<{ w: number; h: number } | null>(null);
  const [hasDecodedVideoFrame, setHasDecodedVideoFrame] = useState(false);

  const hasLiveVideoStream = !!(
    stream &&
    stream.getVideoTracks().some((tr) => tr.readyState === 'live')
  );

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
      setHasDecodedVideoFrame(true);
      const coverScale = Math.max(cW / vW, cH / vH);
      setBoxSize({
        w: Math.ceil(vW * coverScale) + 2,
        h: Math.ceil(vH * coverScale) + 2,
      });
    } else {
      setHasDecodedVideoFrame(false);
      setBoxSize(null);
    }
  }, []);

  useEffect(() => {
    setHasDecodedVideoFrame(false);
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    video.muted = muted;
    video.playsInline = true;
    video.play().catch(() => {});
    recalculateCover();

    const handleTrackChange = () => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      recalculateCover();
    };
    stream.addEventListener('addtrack', handleTrackChange);
    return () => {
      stream.removeEventListener('addtrack', handleTrackChange);
    };
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

  const showRelayOverlay = !!fallbackFrame && (!hasLiveVideoStream || !hasDecodedVideoFrame);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black ${className}`}
    >
      {hasLiveVideoStream && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          onLoadedMetadata={recalculateCover}
          onLoadedData={recalculateCover}
          onResize={recalculateCover}
          onPlaying={recalculateCover}
          style={videoStyle}
        />
      )}
      {showRelayOverlay && (
        <img
          src={fallbackFrame!}
          alt="Live Video Relay"
          className="relative z-[1] w-full h-full object-cover object-center select-none"
          style={{
            transform: fallbackTransform,
            transition: 'transform 200ms ease-out',
          }}
        />
      )}
      {!hasLiveVideoStream && !showRelayOverlay && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          onLoadedMetadata={recalculateCover}
          onLoadedData={recalculateCover}
          onResize={recalculateCover}
          onPlaying={recalculateCover}
          style={videoStyle}
        />
      )}
    </div>
  );
};
