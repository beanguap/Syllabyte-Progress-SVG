export interface BrainProgressProps {
  totalPercent?: number;
  value?: number;
  maxValue?: number;
  backgroundColor?: string;
  showLabel?: boolean;
  width?: number | string;  // Allow percentage values
  height?: number | string; // Allow percentage values
  customColors?: {
    primary?: string;
    secondary?: string;
  };
  animationSpeed?: number;
  isPaused?: boolean;       // Add animation pause control
  reverse?: boolean;        // Add animation direction control
  autoScale?: boolean;      // Add responsive scaling
  onAnimationComplete?: () => void; // Animation completion callback
  fallback?: React.ReactNode; // Content to show while loading
  instantFill?: boolean; // Add this new prop
  autoplay?: boolean; // Auto-fill and drain continuously as a loading indicator
}