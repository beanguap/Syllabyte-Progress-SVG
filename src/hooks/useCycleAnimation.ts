import { useState, useEffect, useRef } from 'react';

interface CycleAnimationOptions {
  speed: number;
  pauseAtPeakMs: number;
  testMode?: boolean;
}

interface CycleAnimationState {
  progress: number;
  isReversed: boolean;
  isPaused: boolean;
}

/**
 * Hook that creates a continuous fill-drain animation cycle
 * with a pause at peak (100%)
 */
export function useCycleAnimation(options: CycleAnimationOptions): CycleAnimationState {
  const { speed, pauseAtPeakMs = 1000, testMode = false } = options;
  
  // State that will be returned
  const [progress, setProgress] = useState<number>(0);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Animation frame reference for cleanup
  const animFrameRef = useRef<number | null>(null);
  
  // References to track actual values between renders
  const lastTimeRef = useRef<number>(0);
  const valueRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1); // 1 for filling, -1 for draining
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (testMode && process.env.NODE_ENV === 'test') {
      return () => {};
    }

    lastTimeRef.current = performance.now();

    function animate(time: number) {
      // Skip animation updates if paused
      if (isPaused) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Update progress based on direction
      const change = (delta / 1000) * speed * directionRef.current;
      valueRef.current = Math.max(0, Math.min(100, valueRef.current + change));
      setProgress(valueRef.current);
      
      // Check if we've reached a limit
      if (valueRef.current >= 100 && directionRef.current > 0) {
        // Reached 100%, pause before reversing
        setIsPaused(true);
        pauseTimeoutRef.current = setTimeout(() => {
          // After pause, reverse direction and continue
          directionRef.current = -1;
          setIsReversed(true);
          setIsPaused(false);
        }, pauseAtPeakMs);
      } else if (valueRef.current <= 0 && directionRef.current < 0) {
        // Reached 0%, reverse direction to start filling again
        directionRef.current = 1;
        setIsReversed(false);
      }

      // Continue animation
      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [speed, pauseAtPeakMs, isPaused, testMode]);
  
  return { progress, isReversed, isPaused };
}

// Helper for tests
export function simulateCycleAnimationState(state: 'initial' | 'filling' | 'peak' | 'draining' | 'complete'): CycleAnimationState {
  const states: Record<typeof state, CycleAnimationState> = {
    initial: { progress: 0, isReversed: false, isPaused: false },
    filling: { progress: 50, isReversed: false, isPaused: false },
    peak: { progress: 100, isReversed: false, isPaused: true },
    draining: { progress: 50, isReversed: true, isPaused: false },
    complete: { progress: 0, isReversed: false, isPaused: false }
  };
  
  return states[state];
}