export interface BrainProgressProps {
    totalPercent?: number;
    value?: number;
    maxValue?: number;
    backgroundColor?: string;
    showLabel?: boolean;
    width?: number;
    height?: number;
    customColors?: {
      primary?: string;
      secondary?: string;
    };
    animationSpeed?: number;
  }