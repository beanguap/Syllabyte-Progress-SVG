import React, { useEffect } from 'react';
import BrainProgress from './BrainProgress';
import { useBrainAnimation } from '../../hooks/useBrainAnimation';
import './BrainProgress.css';

/**
 * AnimationCycleTest Component
 * 
 * Demonstrates a continuous fill-drain animation cycle for BrainProgress using GSAP.
 * The brain fills from 0% to 100%, pauses briefly, then drains back to 0%.
 */
const AnimationCycleTest: React.FC = () => {
  // Detect test environment
  const isTestEnvironment = process.env.NODE_ENV === 'test';
  
  // Use the GSAP-powered animation hook
  const { progress, isReversed, isPaused } = useBrainAnimation({
    pauseAtPeakMs: 1000, // 1 second pause at peak
    animationSpeed: 1,   // Control overall speed
    testMode: isTestEnvironment
  });
  
  // Add debug logging to track state transitions
  useEffect(() => {
    console.log(`State updated - Progress: ${progress.toFixed(1)}%, Reversed: ${isReversed}, Paused: ${isPaused}`);
  }, [progress, isReversed, isPaused]);
  
  return (
    <div className="animation-test" data-reverse={isReversed ? "true" : "false"}>
      <h2>Continuous Fill/Drain Animation</h2>
      
      <div style={{ margin: '20px 0' }}>
        <BrainProgress
          value={progress}
          maxValue={100}
          showLabel={true}
          reverse={isReversed}
          isPaused={isPaused}
          animationSpeed={0.3} // Keep animation smooth within the SVG
          customColors={{
            primary: '#06c9a1',
            secondary: '#007afc'
          }}
          onAnimationComplete={() => console.log(`Animation cycle: ${isReversed ? 'Drain complete' : 'Fill complete'}`)}
        />
      </div>
      
      <div>
        <p>Current progress: {progress.toFixed(1)}%</p>
        <p>Direction: {isReversed ? '⬇️ Draining' : '⬆️ Filling'}</p>
        <p>Status: {isPaused ? 'Paused at peak' : 'Animating'}</p>
        
        {/* Enhanced debug info */}
        <p className="debug-info" style={{ fontSize: '0.8rem', color: '#666' }}>
          State: {isReversed ? 'reverse' : 'forward'}, 
          {isPaused ? ' paused' : ' running'}
          {progress >= 99 ? ', at peak' : ''}
          {progress <= 1 ? ', at bottom' : ''}
        </p>
      </div>
    </div>
  );
};

export default AnimationCycleTest;