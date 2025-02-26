import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BrainProgress from './BrainProgress';

describe('BrainProgress', () => {
  it('renders with default props', () => {
    render(<BrainProgress />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
  });

  it('displays correct progress value', () => {
    render(<BrainProgress value={75} maxValue={100} showLabel={true} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '75');
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('clamps progress value between 0 and 100', () => {
    render(<BrainProgress value={150} maxValue={100} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
  });

  it('shows correct paths based on progress', () => {
    const { container } = render(<BrainProgress value={50} maxValue={100} />);
    
    // At 50%, paths 1 and 6 should be visible
    const path1 = container.querySelector('#path-1');
    const path6 = container.querySelector('#path-6');
    
    expect(path1).toHaveStyle({ opacity: '1' });
    expect(path6).toHaveStyle({ opacity: '1' });
  });

  it('applies custom colors', () => {
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

    const gradient = container.querySelector('#brain-gradient');
    const stops = gradient?.querySelectorAll('stop');
    
    expect(stops?.[0]).toHaveAttribute('stop-color', customColors.primary);
    expect(stops?.[1]).toHaveAttribute('stop-color', customColors.secondary);
  });
});