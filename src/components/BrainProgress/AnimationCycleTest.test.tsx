import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AnimationCycleTest from './AnimationCycleTest';

// Define the mocked module before importing any modules that might use it
vi.mock('../../hooks/useCycleAnimation', () => {
  return {
    useCycleAnimation: vi.fn(),
    simulateCycleAnimationState: vi.fn()
  };
});

// Import the mocked module after defining the mock
import { useCycleAnimation } from '../../hooks/useCycleAnimation';

describe('AnimationCycleTest', () => {
  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('progresses through the fill and drain cycle', () => {
    // Initial state (0%)
    vi.mocked(useCycleAnimation).mockReturnValue({ 
      progress: 0, 
      isReversed: false, 
      isPaused: false 
    });
    
    const { rerender } = render(<AnimationCycleTest />);
    
    // Test initial state
    expect(screen.getByText(/Current progress:/)).toHaveTextContent('Current progress: 0.0%');
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬆️ Filling');
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Animating');
    
    // Mid-filling (50%)
    vi.mocked(useCycleAnimation).mockReturnValue({ 
      progress: 50, 
      isReversed: false, 
      isPaused: false 
    });
    rerender(<AnimationCycleTest />);
    
    // Check progress has increased
    expect(screen.getByText(/Current progress:/)).toHaveTextContent('Current progress: 50.0%');
    
    // Reached 100%, switches direction immediately (not paused)
    vi.mocked(useCycleAnimation).mockReturnValue({ 
      progress: 100, 
      isReversed: true, 
      isPaused: false // Changed from true to false
    });
    rerender(<AnimationCycleTest />);
    
    // Now we should NOT be paused at 100%, but draining
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬇️ Draining');
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Animating');
    
    // Draining (50%)
    vi.mocked(useCycleAnimation).mockReturnValue({ 
      progress: 50, 
      isReversed: true, 
      isPaused: false 
    });
    rerender(<AnimationCycleTest />);
    
    // Should be draining
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬇️ Draining');
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Animating');
    
    // Back to 0%, filling again
    vi.mocked(useCycleAnimation).mockReturnValue({ 
      progress: 0, 
      isReversed: false, 
      isPaused: false 
    });
    rerender(<AnimationCycleTest />);
    
    // Should be filling again
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬆️ Filling');
  });
});