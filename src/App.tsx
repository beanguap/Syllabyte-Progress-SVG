import React, { useState, useEffect, useRef } from 'react';
import BrainProgress from './components/BrainProgress';

const App: React.FC = () => {
  // Fixed speed value at 0.5
  const speed = 0.2; // Removed useState and setSpeed since it's now fixed
  const [progress, setProgress] = useState(75);
  const [isLooping, setIsLooping] = useState(false);
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

  // Keep this to update the ref if speed ever changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    pausingRef.current = isPausingAtEnd;
  }, [isPausingAtEnd]);

  // Improved animation loop
  useEffect(() => {
    if (!isLooping) return;
    
    // Reset state when starting loop
    setProgress(0);
    progressRef.current = 0;
    directionRef.current = 1;
    pausingRef.current = false;
    setIsPausingAtEnd(false);
    
    let rafId: number;
    let lastTimestamp: number | null = null;
    let pauseTimeout: number | null = null; // Fixed: Use number instead of NodeJS.Timeout
    
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
          setProgress(100); // Set twice to ensure state update
          
          // Schedule direction change after a longer delay
          pauseTimeout = setTimeout(() => {
            directionRef.current = -1;
            // Don't reset isPausingAtEnd immediately
            setTimeout(() => {
              pausingRef.current = false;
              setIsPausingAtEnd(false);
            }, 500); // Add a short delay before starting reverse animation
          }, 3500);
        } 
        else if (newProgress <= 0 && directionRef.current < 0) {
          progressRef.current = 0;
          setProgress(0);
          pausingRef.current = true;
          setIsPausingAtEnd(true);
          
          // Schedule direction change
          pauseTimeout = setTimeout(() => {
            directionRef.current = 1;
            pausingRef.current = false;
            setIsPausingAtEnd(false);
          }, 1000);
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
  }, [isLooping]); // Only depend on isLooping to avoid unnecessary restarts
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Brain Progress Demo</h1>
      
      {/* Progress states */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h3>25%</h3>
          <BrainProgress 
            value={25} 
            maxValue={100} 
            showLabel={true}
            instantFill={true} // Use instant fill instead of animation
          />
        </div>

        <div>
          <h3>50%</h3> 
          <BrainProgress 
            value={50} 
            maxValue={100} 
            showLabel={true}
            instantFill={true} 
          />
        </div>

        <div>
          <h3>75%</h3>
          <BrainProgress 
            value={75} 
            maxValue={100} 
            showLabel={true}
            instantFill={true}
          />
        </div>

        <div>
          <h3>100%</h3>
          <BrainProgress 
            value={100} 
            maxValue={100} 
            showLabel={true}
            instantFill={true}
          />
        </div>
      </div>

      {/* Interactive Controls Demo */}
      <div>
        <h2>Interactive Controls</h2>
        <div style={{ 
          padding: '20px', 
          marginBottom: '20px',
          borderRadius: '8px', 
          backgroundColor: '#f5f5f5', 
          maxWidth: '800px' 
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3>Animation Controls</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setIsLooping(!isLooping)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isLooping ? '#ff4500' : '#9932cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {isLooping ? 'Stop Looping' : 'Start Loop Animation'}
              </button>
            </div>
            
            {/* Removed the speed slider section */}
            
            <div>
              <label htmlFor="progress" style={{ display: 'block', marginBottom: '5px' }}>
                Progress: {Math.round(progress)}%
              </label>
              <input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                style={{ width: '200px' }}
                disabled={isLooping}
              />
            </div>
          </div>
          
          <BrainProgress 
            value={progress}
            maxValue={100}
            showLabel={true}
            autoScale={true}
            width="100%"
            height="300px"
            isPaused={isPausingAtEnd}
            animationSpeed={speed} // Will now always be 0.5
            // Change the instantFill logic - ensure it stays visible
            instantFill={progress >= 99} // Always use instantFill for values near 100%
            onAnimationComplete={() => console.log('Animation completed!')}
            customColors={{
              primary: '#ff4500',
              secondary: '#9932cc'
            }}
          />
          
          {/* Status indicator */}
          {isPausingAtEnd && progress === 100 && (
            <div style={{
              marginTop: '10px',
              padding: '5px',
              backgroundColor: 'rgba(6, 201, 161, 0.2)',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              Showing fully animated brain (100%)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
