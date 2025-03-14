import React, { useState, useEffect, useRef } from 'react';
import { AnimationCycleExample } from './components/BrainProgress';

const App: React.FC = () => {
  // Fixed speed value at 0.2
  const speed = 0.2;
  const [progress, setProgress] = useState(75);
  const [isPausingAtEnd, setIsPausingAtEnd] = useState(false);
  
  // Use refs to avoid re-renders and effect dependencies
  const progressRef = useRef(progress);
  const directionRef = useRef(1);
  const pausingRef = useRef(false);
  const speedRef = useRef(speed);
  
  // Update refs when state changes
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    pausingRef.current = isPausingAtEnd;
  }, [isPausingAtEnd]);

  // Animation loop with unused variables removed
  useEffect(() => {
    // Reset state when starting loop
    setProgress(0);
    progressRef.current = 0;
    directionRef.current = 1;
    pausingRef.current = false;
    setIsPausingAtEnd(false);
    
    let rafId: number;
    let lastTimestamp: number | null = null;
    let pauseTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Only update if not paused
      if (!pausingRef.current) {
        // Calculate how much progress to add (smoother with small time steps)
        const progressChange = (elapsed / 1000) * 50 * speedRef.current * directionRef.current;
        
        // Update progress using ref for smoother animation
        const newProgress = Math.max(0, Math.min(100, progressRef.current + progressChange));
        progressRef.current = newProgress;
        
        // Update React state less frequently (for UI updates only)
        setProgress(Math.round(newProgress));
        
        // Handle reaching endpoints
        if (newProgress >= 100 && directionRef.current > 0) {
          progressRef.current = 100;
          setProgress(100);
          pausingRef.current = true;
          setIsPausingAtEnd(true);
          
          // Force the brain to show as fully filled
          setProgress(100);
          
          // Use longer pause at 100% for better visual effect
          pauseTimeout = setTimeout(() => {
            directionRef.current = -1;
            
            // Add a short gap before starting reverse animation
            pauseTimeout = setTimeout(() => {
              pausingRef.current = false;
              setIsPausingAtEnd(false);
            }, 500); // Shorter delay for smoother transition
          }, 2000); // Keep the pause at the 100% point
        } 
        else if (newProgress <= 0 && directionRef.current < 0) {
          progressRef.current = 0;
          setProgress(0);
          pausingRef.current = true;
          setIsPausingAtEnd(true);
          
          // Schedule direction change with smoother transition
          pauseTimeout = setTimeout(() => {
            directionRef.current = 1;
            
            pauseTimeout = setTimeout(() => {
              pausingRef.current = false;
              setIsPausingAtEnd(false);
            }, 500); // Shorter delay for smoother transition
          }, 1200); // Pause at 0%
        }
      }
      
      // Continue animation loop
      rafId = requestAnimationFrame(animate);
    };
    
    // Start animation
    rafId = requestAnimationFrame(animate);
    
    // Clean up
    return () => {
      cancelAnimationFrame(rafId);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, []); // No dependencies needed
  
  // Add this effect to ensure proper display at 100% when manually setting progress
  useEffect(() => {
    // When manually setting to 100% via slider, ensure it stays visible
    if (progress === 100) {
      pausingRef.current = true;
      setIsPausingAtEnd(true);
    }
  }, [progress]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Brain Progress Demo</h1>
      
      <div style={{ 
        padding: '20px', 
        marginBottom: '20px',
        borderRadius: '8px', 
        backgroundColor: '#f0f8ff', 
        maxWidth: '800px' 
      }}>
        <h3>Continuous Animation (No Controls)</h3>
        <AnimationCycleExample 
          width={400}
          height={300}
          animationSpeed={1.2}
        />
      </div>
    </div>
  );
};

export default App;
