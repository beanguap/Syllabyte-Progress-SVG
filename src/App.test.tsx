import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the components used in App
vi.mock('./components/BrainProgress', () => ({
  AnimationCycleExample: () => <div data-testid="animation-cycle-example">Animation Example</div>
}));

describe('App Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  it('renders the Brain Progress demo header', () => {
    render(<App />);
    
    // Check if heading exists instead of specific percentages
    expect(screen.getByText(/Brain Progress Demo/i)).toBeInTheDocument();
    
    // Check if Continuous Animation section exists
    expect(screen.getByText(/Continuous Animation/i)).toBeInTheDocument();
    
    // Check if the mocked component renders
    expect(screen.getByTestId('animation-cycle-example')).toBeInTheDocument();
  });
});