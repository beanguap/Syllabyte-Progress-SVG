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
    
    // Advance timers to complete loading
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    
    // Advance timers to trigger all animations
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    // Check if heading exists
    expect(screen.getByText(/Brain Progress Demo/i)).toBeInTheDocument();
    
    // Check for the headings rather than labels to avoid duplicate matches
    expect(screen.getAllByRole('heading', { level: 3 })[0]).toHaveTextContent('25%');
    expect(screen.getAllByRole('heading', { level: 3 })[1]).toHaveTextContent('50%');
    expect(screen.getAllByRole('heading', { level: 3 })[2]).toHaveTextContent('75%');
    expect(screen.getAllByRole('heading', { level: 3 })[3]).toHaveTextContent('100%');
  });
});