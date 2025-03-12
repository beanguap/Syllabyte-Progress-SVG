import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BrainProgress from './BrainProgress';

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    timeline: () => ({
      kill: vi.fn(),
      add: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
      play: vi.fn(),
      pause: vi.fn(),
      progress: vi.fn().mockReturnValue(0.5),
    }),
    set: vi.fn(),
    to: vi.fn(),
  },
}));

describe('BrainProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    
    // Create the SVG elements that would exist in the real DOM for these tests
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    ['path-1', 'path-2', 'path-3', 'path-4', 'path-5', 'path-6', 'path-7', 'path-8', 'path-9', 'path-10'].forEach(id => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.id = id;
      path.classList.add('brain-path');
      svg.appendChild(path);
    });
    
    document.body.appendChild(svg);
  });

  it('renders with default props', async () => {
    render(<BrainProgress />);
    
    // Advance timers to complete loading
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  });

  it('displays correct progress value with aria attributes', async () => {
    render(<BrainProgress value={75} maxValue={100} />);
    
    // Advance timers to complete loading
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
  });

  it('clamps progress value between 0 and 100', async () => {
    render(<BrainProgress value={150} maxValue={100} />);
    
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('supports custom dimensions', async () => {
    render(<BrainProgress width={300} height={300} />);
    
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    
    const wrapper = document.querySelector('.brain-progress-container');
    expect(wrapper).toHaveStyle('width: 300px');
    expect(wrapper).toHaveStyle('height: 300px');
  });

  it('supports paused state', async () => {
    const { rerender } = render(<BrainProgress isPaused={false} />);
    
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    
    // Pause the animation
    rerender(<BrainProgress isPaused={true} />);
    
    const progressContainer = document.querySelector('.brain-progress-container');
    expect(progressContainer).toHaveAttribute('data-paused', 'true');
  });
});