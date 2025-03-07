import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AnimationCycleTest from './AnimationCycleTest';

describe('AnimationCycleTest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      return setTimeout(() => callback(performance.now()), 16) as unknown as number;
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
    
    // Advance time to simulate animation progress (about halfway)
    await act(async () => {
      // Fast-forward time
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      }
    });
    
    // Check that progress has increased
    const progressText = screen.getByText(/Current progress:/);
    const currentProgress = parseFloat(progressText.textContent?.match(/[\d.]+/)![0] || '0');
    expect(currentProgress).toBeGreaterThan(0);
    
    // Advance to 100%
    await act(async () => {
      for (let i = 0; i < 50; i++) {
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      }
    });
    
    // Should pause at 100%
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Paused');
    
    // Advance past pause duration
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });
    
    // Should be draining now
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬇️ Draining');
    expect(screen.getByText(/Status:/)).toHaveTextContent('Status: Animating');
    
    // Advance to 0%
    await act(async () => {
      for (let i = 0; i < 50; i++) {
        vi.advanceTimersByTime(100);
        await Promise.resolve();
      }
    });
    
    // Should be filling again
    expect(screen.getByText(/Direction:/)).toHaveTextContent('Direction: ⬆️ Filling');
  });
});