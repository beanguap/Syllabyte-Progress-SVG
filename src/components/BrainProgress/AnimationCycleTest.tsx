import React from 'react';
import BrainProgress from './BrainProgress';
import { useCycleAnimation } from '../../hooks/useCycleAnimation';
import './BrainProgress.css';

/**
 * AnimationCycleTest Component
 * 
 * Demonstrates a continuous fill and drain animation cycle for BrainProgress.
 * The brain fills from 0% to 100%, pauses briefly, then drains back to 0%.
 */
const AnimationCycleTest: React.FC = () => {
  // Use the custom hook for cycle animation with configured speed and pause duration
  const { progress, isReversed, isPaused } = useCycleAnimation({
    speed: 100, // Fast animation speed as requested (100 units per second)
    pauseAtPeakMs: 1000, // 1 second pause at 100%
  });
  
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
        <p>Status: {isPaused ? 'Paused' : 'Animating'}</p>
      </div>
    </div>
  );
};

export default AnimationCycleTest;