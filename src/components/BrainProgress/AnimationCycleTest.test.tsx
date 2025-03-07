import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AnimationCycleTest from './AnimationCycleTest';

describe('AnimationCycleTest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    
    // Mock requestAnimationFrame with a more predictable behavior
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      return setTimeout(() => callback(performance.now()), 16) as unknown as number;
    });
    
    // Mock performance.now to increment predictably
    let mockTime = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      mockTime += 16;
      return mockTime;
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('progresses through the fill and drain cycle', async () => {
    render(<AnimationCycleTest />);
    
    // Test initial state
    expect(screen.getByText(/Current progress:/)).toHaveTextContent('Current progress: 0.0%');
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬆️ Filling');
    
    // Advance time to simulate animation progress (about 50%)
    await act(async () => {
      for (let i = 0; i < 35; i++) {
        vi.advanceTimersByTime(16);
      }
    });
    
    // Check that progress has increased
    const progressText = screen.getByText(/Current progress:/);
    const currentProgress = parseFloat(progressText.textContent?.match(/[\d.]+/)![0] || '0');
    expect(currentProgress).toBeGreaterThan(0);
    
    // Advance to reach 100%
    await act(async () => {
      for (let i = 0; i < 100; i++) {
        vi.advanceTimersByTime(16);
      }
    });
    
    // Need an additional tick for React to update state after reaching 100%
    await act(async () => {
      vi.advanceTimersByTime(20);
    });
    
    // Now we should be paused at 100%
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Paused');
    
    // Advance past pause duration (1000ms)
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    
    // Should be draining now
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬇️ Draining');
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Animating');
    
    // Advance to 0%
    await act(async () => {
      for (let i = 0; i < 100; i++) {
        vi.advanceTimersByTime(16);
      }
    });
    
    // Should be filling again
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬆️ Filling');
  });
});