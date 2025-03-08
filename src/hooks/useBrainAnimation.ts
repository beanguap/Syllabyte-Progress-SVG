import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface BrainAnimationOptions {
  pauseAtPeakMs?: number;
  animationSpeed?: number;
  testMode?: boolean;
}

interface BrainAnimationState {
  progress: number;
  isReversed: boolean;
  isPaused: boolean;
}

/**
 * Hook that uses GSAP to create a smooth, continuous fill-drain animation cycle
 * for the brain SVG with proper pausing at peak (100%)
 */
export function useBrainAnimation({
    pauseAtPeakMs = 1000,
    animationSpeed = 1,
    testMode = false
  }: BrainAnimationOptions = {}): BrainAnimationState {
    const [progress, setProgress] = useState(0);
    const [isReversed, setIsReversed] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const isMounted = useRef(true);
  
    useEffect(() => {
      if (testMode) return;
  
      const tl = gsap.timeline({
        repeat: -1,
        onUpdate: () => {
          if (!isMounted.current) return;
          setProgress(Math.round(gsap.getProperty("#progress") as number));
        }
      });
  
      // Fill phase
      tl.to("#progress", {
        value: 100,
        duration: 5/animationSpeed,
        ease: "power2.inOut",
        modifiers: {
          value: (v) => Math.round(v)
        },
        onStart: () => {
          setIsReversed(false);
          setIsPaused(false);
        }
      });
  
      // Peak pause
      tl.add(() => {
        setIsPaused(true);
        gsap.delayedCall(pauseAtPeakMs/1000, () => {
          setIsReversed(true);
          setIsPaused(false);
        });
      });
  
      // Drain phase
      tl.to("#progress", {
        value: 0,
        duration: 5/animationSpeed,
        ease: "power2.inOut",
        onStart: () => setIsReversed(true)
      });
  
      timelineRef.current = tl;
      return () => {
        isMounted.current = false;
        timelineRef.current?.kill();
      };
    }, [animationSpeed, pauseAtPeakMs, testMode]);
  
    return { progress, isReversed, isPaused };
  }