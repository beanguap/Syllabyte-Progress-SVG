import React, { useEffect, useState, useRef, useMemo } from 'react';
import '../styles/BrainProgress.css'; // Fixed relative import path

// Define the component props interface
interface BrainProgressProps {
  // Core progress props
  totalPercent?: number;
  value?: number;
  maxValue?: number;
  
  // Visual customization
  backgroundColor?: string;
  showLabel?: boolean;
  
  // Optional customization
  width?: number;
  height?: number;
  customColors?: {
    primary?: string;
    secondary?: string;
  };
  animationSpeed?: number;
}

const BrainProgress: React.FC<BrainProgressProps> = ({
  totalPercent,
  value,
  maxValue,
  backgroundColor,
  showLabel = false,
  width = 200,
  height = 200,
  customColors = {
    primary: '#06c9a1',
    secondary: '#007afc'
  },
  animationSpeed = 1
}) => {
  // Calculate the progress percentage with useMemo for optimization
  const progress = useMemo(() => {
    if (value !== undefined && maxValue !== undefined && maxValue > 0) {
      return Math.min(100, Math.max(0, (value / maxValue) * 100));
    }
    return totalPercent !== undefined ? Math.min(100, Math.max(0, totalPercent)) : 0;
  }, [totalPercent, value, maxValue]);

  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Set initial render state to false after first render
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, []);

  // Define path IDs in order of animation sequence
  const pathIds = [
    "path-1", // Bottom right curve
    "path-2", // Top right circle
    "path-3", // Top right small circle
    "path-4", // Top arch
    "path-5", // Middle arch
    "path-6", // Bottom right arch
    "path-7", // Top right small path
    "path-8", // Top right tiny path
    "path-9", // Bottom left circle
  ];

  // Function to get path length
  const getPathLength = (pathElement: SVGPathElement): number => {
    return pathElement.getTotalLength();
  };

  // Apply animation styles to path
  const getPathStyles = (pathElement: SVGPathElement, index: number) => {
    if (isInitialRender || !pathElement) return {};
    
    const pathLength = getPathLength(pathElement);
    const delay = index * 0.1 * animationSpeed; // Sequential delay
    const duration = animationSpeed;
    
    const dashoffset = pathLength - (pathLength * progress / 100);
    
    return {
      strokeDasharray: `${pathLength}px`,
      strokeDashoffset: `${dashoffset}px`,
      transition: `stroke-dashoffset ${duration}s ease-in-out ${delay}s`,
      opacity: 1, // Make sure paths are visible during animation
    };
  };

  useEffect(() => {
    // Apply animation when progress changes or after initial render
    if (!isInitialRender && svgRef.current) {
      pathIds.forEach((id, index) => {
        const pathElement = svgRef.current?.querySelector(`#${id}`) as SVGPathElement;
        if (pathElement) {
          const styles = getPathStyles(pathElement, index);
          Object.entries(styles).forEach(([key, value]) => {
            pathElement.style[key as any] = value as string;
          });
        }
      });
    }
  }, [progress, isInitialRender, animationSpeed]);

  return (
    <div 
      className="brain-progress-container" 
      style={{ width, height }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <svg 
        ref={svgRef}
        className="brain-progress-svg" 
        viewBox="0 0 1000 1000" 
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        {backgroundColor && (
          <rect 
            x="0" 
            y="0" 
            width="1000" 
            height="1000" 
            fill={backgroundColor} 
            rx="10" 
            ry="10"
          />
        )}
        
        <defs>
          <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={customColors.primary}/>
            <stop offset="1" stopColor={customColors.secondary}/>
          </linearGradient>
        </defs>
        
        {/* Path 1 - Bottom right curve */}
        <path id="path-1" 
          d="M641.22,896.98c-11.97,0-23.26-7.29-27.76-19.15-11.15-29.17-50.64-109.64-98.7-131.12-14.97-6.69-21.68-24.25-14.99-39.23,6.7-14.97,24.26-21.68,39.23-14.99,79.09,35.35,125,151.15,129.97,164.24,5.83,15.33-1.88,32.48-17.2,38.31-3.47,1.32-7.04,1.95-10.55,1.95Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Path 2 - Top right circle */}
        <path id="path-2" 
          d="M767.07,518.5c-.83,0-1.66-.03-2.5-.1-.69-.06-1.43-.15-2.12-.25-16.21-2.49-27.33-17.66-24.83-33.87,2.46-15.97,17.23-26.98,33.14-24.94,15.7,1.97,27.19,16.01,25.87,31.93-1.29,15.5-14.28,27.23-29.56,27.23Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Path 3 - Top right small circle */}
        <path id="path-3" 
          d="M688.96,510.71c-.77,0-1.54-.03-2.32-.09-8.06-.62-16.39-1.21-24.76-1.7-16.37-.97-28.86-15.03-27.88-31.4.98-16.37,15.09-28.86,31.4-27.88,8.24.49,16.93,1.09,25.83,1.78,16.35,1.27,28.58,15.55,27.31,31.9-1.21,15.57-14.22,27.4-29.57,27.4Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Path 4 - Top arch */}
        <path id="path-4" 
          d="M681.84,175.61c-6.01,15.27-23.2,22.81-38.5,16.84-50.97-19.95-107.84-30.04-169.08-30.04-177.12,0-294.43,63.93-345.15,123.77-22.57,26.62-33.82,54.53-31.13,77.03l-58.38,11.25c-6.43-40.52,9.26-85.48,44.19-126.71,76.86-90.62,222.81-144.73,390.46-144.73,68.68,0,132.82,11.46,190.74,34.13,15.27,5.97,22.81,23.2,16.84,38.46Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Path 5 - Middle arch */}
        <path id="path-5" 
          d="M954.71,542.01l-55.69-20.65c11.91-32.14-7.97-73.71-44.33-92.68-95.79-49.96-351.62-29.8-536.77,42.31-78.25,30.46-155.07,29.73-210.87-2.03-36.89-21-60.79-54.25-67.35-93.69-.03-.28-.07-.52-.1-.8l58.38-11.25c.07.8.17,1.57.31,2.34,4.58,27.46,23.27,43.32,38.15,51.81,39.58,22.53,99.35,21.87,159.93-1.71,179.21-69.8,463.86-103.23,585.82-39.62,62.95,32.84,94.81,105.75,72.52,165.97Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Path 6 - Bottom right arch */}
        <path id="path-6" 
          d="M805.47,634.79c15.13,16.52,24.98,36.44,25.75,60.3,1.05,32.35-15.34,59.84-46.15,77.42-25.54,14.6-60.12,21.59-97.75,21.59-59.11,0-125.69-17.26-176.35-49.43-72.56-46.04-109.66-121.5-92.23-187.7,7.97-30.39,40.63-101.8,170.83-108.51l1.64-.07c16.38-.73,30.29,11.88,31.06,28.26.77,16.35-11.88,30.29-28.26,31.06l-1.4.07c-64.14,3.28-106.59,26.72-116.44,64.28-10.66,40.45,16.77,90.83,66.62,122.48,69.07,43.84,171.14,50.2,212.86,26.41,14.78-8.45,16.42-17.26,16.21-23.97-.94-29.69-51.88-54.18-104.66-68.58-19.39-3.11-40.03-7.2-62.11-12.33-15.37-3.6-25.26-18.55-22.5-34.1,2.76-15.55,17.19-26.2,32.87-24.31,7.2.91,32.91,4.4,64.21,12.61,138.86,21.87,204.51-8.91,219.35-48.91l55.69,20.65c-10.83,29.21-44.79,81.64-149.24,92.79Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Path 7 - Top right small path */}
        <path id="path-7" 
          d="M786.07,277.8c-7.35,0-14.71-2.71-20.46-8.18-12.45-11.84-25.98-22.96-40.2-33.05-13.38-9.49-16.53-28.02-7.04-41.4,9.49-13.38,28.03-16.53,41.4-7.05,16.53,11.72,32.27,24.66,46.77,38.46,11.89,11.3,12.36,30.1,1.05,41.98-5.84,6.14-13.67,9.23-21.52,9.23Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Path 8 - Top right tiny path */}
        <path id="path-8" 
          d="M841.09,345.25c-10.63,0-20.89-5.73-26.22-15.72-7.78-14.34-2.53-32.29,11.78-40.17,14.36-7.92,32.42-2.68,40.34,11.68.14.25.37.67.49.92,7.5,14.58,1.76,32.49-12.82,39.99-4.35,2.23-8.99,3.29-13.56,3.29Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Path 9 - Bottom left circle */}
        <path id="path-9" 
          d="M308.6,720.68c-4.03,0-8.11-.82-12.03-2.56-45.96-20.4-69.97-57.7-67.6-105.03,7.09-141.81,255.17-162.4,361.5-164.67,16.36-.43,29.97,12.66,30.32,29.05.35,16.4-12.66,29.97-29.05,30.32-84.34,1.8-160.4,12.9-214.15,31.24-39.66,13.53-87.34,37.88-89.3,77.02-.76,15.22,2.23,34.4,32.38,47.78,14.99,6.65,21.75,24.2,15.09,39.19-4.91,11.07-15.77,17.65-27.16,17.65Z" 
          fill="none"
          stroke="url(#brain-gradient)" 
          strokeWidth="4"
          strokeLinecap="round"
          className="brain-path"
        />
        
        {/* Center progress text holder */}
        {showLabel && (
          <g>
            <circle cx="500" cy="500" r="80" fill="rgba(255, 255, 255, 0.7)" />
            <text 
              x="500" 
              y="500" 
              fontSize="40" 
              fontWeight="bold" 
              fill="#333" 
              textAnchor="middle" 
              dominantBaseline="middle"
            >
              {Math.round(progress)}%
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default BrainProgress;