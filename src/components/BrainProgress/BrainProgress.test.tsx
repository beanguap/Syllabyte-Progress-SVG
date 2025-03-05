import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BrainProgress from './BrainProgress';

describe('BrainProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders with default props', async () => {
    render(<BrainProgress />);
    const progressbar = screen.getByRole('progressbar');
    
    // Advance timers to complete animations
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
  });

  it('displays correct progress value', async () => {
    render(<BrainProgress value={75} maxValue={100} showLabel={true} />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('clamps progress value between 0 and 100', async () => {
    render(<BrainProgress value={150} maxValue={100} />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('shows correct paths based on progress', async () => {
    const { container } = render(<BrainProgress value={50} maxValue={100} />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    const path1 = container.querySelector('#path-1');
    const path6 = container.querySelector('#path-6');
    
    expect(path1).toHaveStyle({ opacity: '1' });
    expect(path6).toHaveStyle({ opacity: '1' });
  });

  it('applies custom colors', async () => {
    const customColors = {
      primary: '#ff0000',
      secondary: '#0000ff'
    };

    const { container } = render(
      <BrainProgress 
        value={100} 
        maxValue={100} 
        customColors={customColors}
      />
    );

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const gradient = container.querySelector('#brain-gradient');
    const stops = gradient?.querySelectorAll('stop');
    
    expect(stops?.[0]).toHaveAttribute('stop-color', customColors.primary);
    expect(stops?.[1]).toHaveAttribute('stop-color', customColors.secondary);
  });

  it('handles totalPercent prop correctly', async () => {
    render(<BrainProgress totalPercent={60} showLabel={true} />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '60');
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('respects custom dimensions', async () => {
    const { container } = render(
      <BrainProgress 
        value={50} 
        maxValue={100} 
        width={300} 
        height={300} 
      />
    );
    
    const wrapper = container.querySelector('.brain-progress-container');
    expect(wrapper).toHaveStyle({
      width: '300px',
      height: '300px'
    });
  });

  it('handles background color prop', async () => {
    const { container } = render(
      <BrainProgress 
        value={50} 
        maxValue={100} 
        backgroundColor="#f0f0f0" 
      />
    );
    
    const rect = container.querySelector('rect');
    expect(rect).toHaveAttribute('fill', '#f0f0f0');
  });

  it('handles animation timing correctly', async () => {
    const { container } = render(
      <BrainProgress 
        value={75} 
        maxValue={100} 
        animationSpeed={2} 
      />
    );
    
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    
    const path = container.querySelector('#path-1');
    expect(path).toHaveStyle({
      animation: expect.stringContaining('2.4s') // 2 * 1.2
    });
  });

  it('updates progress when value changes', async () => {
    const { rerender } = render(
      <BrainProgress value={25} maxValue={100} showLabel={true} />
    );
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('25%')).toBeInTheDocument();
    
    rerender(<BrainProgress value={50} maxValue={100} showLabel={true} />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('adds data-progress attribute with correct value', async () => {
    const { container } = render(<BrainProgress value={50} maxValue={100} />);
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    const progressContainer = container.querySelector('.brain-progress-container');
    expect(progressContainer).toHaveAttribute('data-progress', '50');
  });

  it('supports pause functionality', async () => {
    const { container, rerender } = render(
      <BrainProgress value={50} maxValue={100} isPaused={false} />
    );
    
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    
    // Pause the animation
    rerender(<BrainProgress value={50} maxValue={100} isPaused={true} />);
    
    const progressContainer = container.querySelector('.brain-progress-container');
    expect(progressContainer).toHaveAttribute('data-paused', 'true');
  });

  it('supports auto-scaling when enabled', async () => {
    const { container } = render(
      <BrainProgress value={50} maxValue={100} autoScale={true} />
    );
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    // Mock the ResizeObserver
    const resizeObserverInstance = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    };
    
    // @ts-ignore - Mock implementation
    window.ResizeObserver = vi.fn(() => resizeObserverInstance);
    
    expect(container.querySelector('.brain-progress-container')).toBeInTheDocument();
  });

  it('calls onAnimationComplete callback when animation finishes', async () => {
    const onCompleteMock = vi.fn();
    
    render(
      <BrainProgress 
        value={100} 
        maxValue={100} 
        animationSpeed={0.2}
        onAnimationComplete={onCompleteMock} 
      />
    );
    
    // Advance time to complete all animations
    await act(async () => {
      vi.advanceTimersByTime(5000); // Ensure all animations complete
    });
    
    expect(onCompleteMock).toHaveBeenCalled();
  });
});