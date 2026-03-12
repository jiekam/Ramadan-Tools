import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to monitor server health and wake up the backend.
 * Useful for free-tier hosting like Koyeb that sleeps after inactivity.
 */
export function useServerHealth() {
  const [isReady, setIsReady] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [error, setError] = useState(null);

  const checkHealth = useCallback(async () => {
    let API_BASE = import.meta.env.VITE_API_URL || '';
    if (API_BASE && !API_BASE.startsWith('http')) {
      API_BASE = `https://${API_BASE}`;
    }
    API_BASE = API_BASE.replace(/\/$/, '');

    try {
      setIsWakingUp(true);
      const res = await fetch(`${API_BASE}/api/health`, {
        signal: AbortSignal.timeout(5000), // Timeout after 5s
      });
      
      if (res.ok) {
        setIsReady(true);
        setIsWakingUp(false);
        return true;
      }
    } catch (err) {
      console.warn('[ServerHealth] Ping failed, server might be sleeping...', err.message);
    }
    return false;
  }, []);

  useEffect(() => {
    let timer;
    let pollInterval;

    // Start timer if waking up
    if (isWakingUp && !isReady) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }

    // Initial check
    const startInitialCheck = async () => {
      const ok = await checkHealth();
      if (!ok) {
        // Poll every 3 seconds until ready
        pollInterval = setInterval(async () => {
          const ready = await checkHealth();
          if (ready) {
            clearInterval(pollInterval);
            clearInterval(timer);
          }
        }, 3000);
      }
    };

    startInitialCheck();

    return () => {
      if (timer) clearInterval(timer);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [checkHealth, isReady]);

  return { isReady, isWakingUp, secondsElapsed, error };
}
