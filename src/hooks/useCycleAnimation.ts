import { useState, useEffect, useRef } from 'react';

interface CycleAnimationOptions {
  speed: number;
  pauseAtPeakMs: number;
}

interface CycleAnimationState {
  progress: number;
  isReversed: boolean;
  isPaused: boolean;
}

/**
 * Custom hook to manage a continuous fill-drain animation cycle
 * 
 * @param options Configuration options for the animation cycle
 * @param options.speed Animation speed (units per second)
 * @param options.pauseAtPeakMs Milliseconds to pause at 100% before draining
 * @returns Animation state (progress, direction, and pause status)
 */
export function useCycleAnimation(options: CycleAnimationOptions): CycleAnimationState {
  const { speed, pauseAtPeakMs } = options;
  
  const [progress, setProgress] = useState<number>(0);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const directionRef = useRef<number>(1);
  const progressRef = useRef<number>(0);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current === null) {
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const deltaTime = time - previousTimeRef.current;
      previousTimeRef.current = time;
      
      if (!isPaused) {
        // Calculate new progress
        const progressDelta = (deltaTime / 1000) * speed * directionRef.current;
        const newProgress = Math.max(0, Math.min(100, progressRef.current + progressDelta));
        
        // Update progress refs and state
        progressRef.current = newProgress;
        setProgress(newProgress);
        
        // Check for direction change
        if (newProgress >= 100 && directionRef.current > 0) {
          // Reached 100%, pause before reversing
          directionRef.current = 0;
          setIsPaused(true);
          progressRef.current = 100;
          setProgress(100);
          
          // Schedule reversal after pause
          pauseTimeoutRef.current = setTimeout(() => {
            directionRef.current = -1;
            setIsReversed(true);
            setIsPaused(false);
          }, pauseAtPeakMs);
        }
        else if (newProgress <= 0 && directionRef.current < 0) {
          // Reached 0%, immediately start filling again
          directionRef.current = 1;
          setIsReversed(false);
          progressRef.current = 0;
          setProgress(0);
        }
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      if (pauseTimeoutRef.current !== null) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [speed, pauseAtPeakMs, isPaused]);
  
  return { progress, isReversed, isPaused };
}