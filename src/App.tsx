import React, { useState, useEffect, useRef } from 'react';
// Use the barrel import instead
import { BrainProgress, AnimationCycleTest } from './components/BrainProgress';

const App: React.FC = () => {
  // Fixed speed value at 0.2
  const speed = 0.2;
  const [progress, setProgress] = useState(75);
  const [isLooping, setIsLooping] = useState(false);
  const [isPausingAtEnd, setIsPausingAtEnd] = useState(false);
  // Add a new state to track animation direction
  const [isReversed, setIsReversed] = useState(false);
  
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
    setIsReversed(false); // Reset reverse state
    
    let rafId: number;
    let lastTimestamp: number | null = null;
    // Change type to NodeJS.Timeout | null
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
            setIsReversed(true); // Set reversed flag BEFORE unpausing
            
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
            setIsReversed(false); // Reset reversed flag BEFORE unpausing
            
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
  }, [isLooping]); // Only depend on isLooping to avoid unnecessary restarts
  
  // Add this effect to ensure proper display at 100% when manually setting progress
  useEffect(() => {
    // When manually setting to 100% via slider, ensure it stays visible
    if (progress === 100 && !isLooping) {
      pausingRef.current = true;
      setIsPausingAtEnd(true);
      setIsReversed(false); // Reset reverse state for manual setting
    }
  }, [progress, isLooping]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Brain Progress Demo</h1>
      
      {/* Add the continuous animation test */}
      <div style={{ 
        padding: '20px', 
        marginBottom: '20px',
        borderRadius: '8px', 
        backgroundColor: '#f0f8ff', 
        maxWidth: '800px' 
      }}>
        <AnimationCycleTest />
      </div>
      
      {/* Progress states */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h3>25%</h3>
          <BrainProgress 
            value={25} 
            maxValue={100} 
            showLabel={true}
            instantFill={true} // Always use instantFill for static examples
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
            animationSpeed={speed}
            // Pass the isReversed state to control animation direction
            reverse={isReversed}
            // Modified to ensure 100% always shows correctly
            instantFill={!isLooping || progress === 100}
            onAnimationComplete={() => console.log('Animation completed!')}
            customColors={{
              primary: '#ff4500',
              secondary: '#9932cc'
            }}
          />
          
          {/* Status indicator */}
          {isPausingAtEnd && (
            <div style={{
              marginTop: '10px',
              padding: '5px',
              backgroundColor: progress === 100 ? 'rgba(6, 201, 161, 0.2)' : 'rgba(255, 69, 0, 0.2)',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {progress === 100 
                ? 'Showing fully animated brain (100%)' 
                : `Animation paused at ${progress}%`}
            </div>
          )}

          {/* Add direction indicator */}
          {isLooping && (
            <div style={{
              marginTop: '10px',
              padding: '5px',
              backgroundColor: 'rgba(0, 122, 252, 0.2)',
              borderRadius: '4px',
              textAlign: 'center',
            }}>
              Direction: {isReversed ? '⬇️ Decreasing' : '⬆️ Increasing'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
