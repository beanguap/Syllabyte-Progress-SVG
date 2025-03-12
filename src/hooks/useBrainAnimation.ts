import { useState, useEffect, useRef } from 'react';

interface BrainAnimationOptions {
  pauseAtPeakMs?: number;
  animationSpeed?: number;
  startAtPercent?: number;
  testMode?: boolean;
}

export function useBrainAnimation({
  pauseAtPeakMs = 1000,
  animationSpeed = 1,
  startAtPercent = 0,
  testMode = false
}: BrainAnimationOptions = {}) {
  const [progress, setProgress] = useState(startAtPercent);
  const [isPaused, setIsPaused] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  
  // Add initial values to all refs
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const progressRef = useRef<number>(progress);
  const isReversedRef = useRef<boolean>(isReversed);
  const isPausedRef = useRef<boolean>(isPaused);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Update refs when state changes
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  
  useEffect(() => {
    isReversedRef.current = isReversed;
  }, [isReversed]);
  
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (testMode) return; // Skip animation in test environment
    
    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }
      
      const deltaTime = time - previousTimeRef.current;
      previousTimeRef.current = time;
      
      // Only update if not paused
      if (!isPausedRef.current) {
        // Calculate progress change
        const direction = isReversedRef.current ? -1 : 1;
        const progressChange = (deltaTime / 1000) * 40 * animationSpeed * direction;
        
        // Update progress
        const newProgress = Math.max(0, Math.min(100, progressRef.current + progressChange));
        progressRef.current = newProgress;
        setProgress(newProgress);
        
        // Check for reaching top or bottom
        if (newProgress >= 100 && !isReversedRef.current) {
          // Reached 100%, pause then reverse
          setIsPaused(true);
          isPausedRef.current = true;
          
          pauseTimerRef.current = setTimeout(() => {
            setIsReversed(true);
            isReversedRef.current = true;
            
            setTimeout(() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }, 100);
          }, pauseAtPeakMs);
        }
        else if (newProgress <= 0 && isReversedRef.current) {
          // Reached 0%, switch direction and continue
          setIsReversed(false);
          isReversedRef.current = false;
        }
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [animationSpeed, pauseAtPeakMs, testMode]);
  
  return { progress, isPaused, isReversed };
}

export default useBrainAnimation;