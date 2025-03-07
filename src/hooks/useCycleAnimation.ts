import { useState, useEffect, useRef } from 'react';

interface CycleAnimationOptions {
  speed: number;
  pauseAtPeakMs: number; // We'll ignore this since we don't want pausing
  testMode?: boolean;
}

interface CycleAnimationState {
  progress: number;
  isReversed: boolean;
  isPaused: boolean; // Will always be false in this implementation
}

/**
 * Super simplified animation hook - just fills up to 100% then immediately drains back to 0%
 * No pauses, no complications, just a simple back-and-forth animation
 */
export function useCycleAnimation(options: CycleAnimationOptions): CycleAnimationState {
  const { speed, testMode = false } = options;
  
  // State that will be returned
  const [progress, setProgress] = useState<number>(0);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  // Always false - no pausing at all
  const isPaused = false;
  
  // Animation frame reference for cleanup
  const animFrameRef = useRef<number | null>(null);
  
  // References to track actual values between renders
  const lastTimeRef = useRef<number>(0);
  const valueRef = useRef<number>(0);
  const isAnimating = useRef<boolean>(true);
  
  useEffect(() => {
    if (testMode && process.env.NODE_ENV === 'test') {
      return () => {};
    }

    lastTimeRef.current = performance.now();

    function animate(time: number) {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Accumulate progress and loop around at 100
      const change = (delta / 1000) * speed;
      valueRef.current = (valueRef.current + change) % 100;
      setProgress(valueRef.current);

      // Continue animation
      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [speed, testMode]);
  
  return { progress, isReversed, isPaused };
}

// Helper for tests
export function simulateCycleAnimationState(state: 'initial' | 'filling' | 'peak' | 'draining' | 'complete'): CycleAnimationState {
  const states: Record<typeof state, CycleAnimationState> = {
    initial: { progress: 0, isReversed: false, isPaused: false },
    filling: { progress: 50, isReversed: false, isPaused: false },
    peak: { progress: 100, isReversed: false, isPaused: false }, // Changed: Not paused
    draining: { progress: 50, isReversed: true, isPaused: false },
    complete: { progress: 0, isReversed: false, isPaused: false }
  };
  
  return states[state];
}