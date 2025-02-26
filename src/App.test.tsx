import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

describe('App Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the BrainProgress components with correct progress', async () => {
    render(<App />);
    
    // Advance timers to trigger all animations
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    // Check if heading exists
    expect(screen.getByText(/Brain Progress Demo/i)).toBeInTheDocument();
    
    // Check for one of the progress labels
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});