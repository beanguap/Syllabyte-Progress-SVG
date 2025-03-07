import React, { useEffect } from 'react';
import BrainProgress from './BrainProgress';
import { useCycleAnimation } from '../../hooks/useCycleAnimation';
import './BrainProgress.css';

/**
 * AnimationCycleTest Component
 * 
 * Demonstrates a continuous fill-drain animation cycle for BrainProgress.
 * The brain fills from 0% to 100%, then drains back to 0%.
 */
const AnimationCycleTest: React.FC = () => {
  // Detect test environment
  const isTestEnvironment = process.env.NODE_ENV === 'test';
  
  // Use the custom hook for cycle animation with configured speed and pause duration
  const { progress, isReversed } = useCycleAnimation({
    speed: 20, // Reduced from 100 to 25 for a more visible animation
    pauseAtPeakMs: 0, // No pause at peak
    testMode: isTestEnvironment // Enable test mode in test environment
  });
  
  // Add debugging to help track what's happening
  useEffect(() => {
    if (progress >= 99) {
      console.log('Reached peak, should reverse soon');
    }
    if (isReversed && progress <= 1) {
      console.log('Reached bottom, should start filling again');
    }
  }, [progress, isReversed]);
  
  return (
    <div className="animation-test" data-reverse={isReversed ? "true" : "false"}>
      <h2>Continuous Fill/Drain Animation</h2>
      
      <div style={{ margin: '20px 0' }}>
        <BrainProgress
          value={progress}
          maxValue={100}
          showLabel={true}
          reverse={isReversed}
          isPaused={false} // Never paused
          animationSpeed={0.3} // Keep animation smooth
          customColors={{
            primary: '#06c9a1',
            secondary: '#007afc'
          }}
        />
      </div>
      
      <div>
        <p>Current progress: {progress.toFixed(1)}%</p>
        <p>Direction: {isReversed ? '⬇️ Draining' : '⬆️ Filling'}</p>
        <p>Status: Animating</p> {/* Always animating */}
        
        {/* Debug info */}
        <p className="debug-info" style={{ fontSize: '0.8rem', color: '#666' }}>
          State: {isReversed ? 'reverse' : 'forward'}, running
          {progress >= 99 ? ', at peak' : ''}
          {progress <= 1 ? ', at bottom' : ''}
        </p>
      </div>
    </div>
  );
};

export default AnimationCycleTest;