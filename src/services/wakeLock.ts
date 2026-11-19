import { useEffect } from 'react';

/**
 * Screen Wake Lock Manager
 * Prevents mobile phone screens from dimming/sleeping while Oneworld is open.
 * Automatically acquires on mount, on first user gesture (for strict mobile WebViews),
 * and re-acquires whenever the tab/app returns to foreground visibility.
 */
export function useScreenWakeLock(active = true) {
  useEffect(() => {
    if (!active || typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    let wakeLockSentinel: any = null;
    let released = false;

    const requestWakeLock = async () => {
      if (released || document.visibilityState !== 'visible') return;
      const wakeLockApi = (navigator as any).wakeLock;
      if (!wakeLockApi || typeof wakeLockApi.request !== 'function') return;
      if (wakeLockSentinel && !wakeLockSentinel.released) return;

      try {
        wakeLockSentinel = await wakeLockApi.request('screen');
        wakeLockSentinel?.addEventListener?.('release', () => {
          wakeLockSentinel = null;
        });
      } catch {
        // Some mobile browsers defer WakeLock until the first user touch/click gesture
      }
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    const handleFirstGesture = () => {
      requestWakeLock();
    };

    // Request immediately on mount
    requestWakeLock();

    // Re-request on visibility change, window focus, and touch/pointer interactions
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });

    // Periodic safety check every 45s in case the OS silently dropped the sentinel
    const keepAliveTimer = window.setInterval(() => {
      if (!wakeLockSentinel && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    }, 45000);

    return () => {
      released = true;
      window.clearInterval(keepAliveTimer);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      if (wakeLockSentinel) {
        try {
          wakeLockSentinel.release();
        } catch {}
        wakeLockSentinel = null;
      }
    };
  }, [active]);
}
