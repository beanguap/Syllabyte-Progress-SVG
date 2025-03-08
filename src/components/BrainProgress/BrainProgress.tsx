import React, { useEffect, useState, useRef, useMemo, Suspense } from 'react';
import { BrainProgressProps } from './types';
import { gsap } from 'gsap'; // Import GSAP
import './BrainProgress.css'; 

const BrainProgress: React.FC<BrainProgressProps> = ({
  totalPercent,
  value,
  maxValue,
  backgroundColor,
  showLabel = false,
  width = 200,
  height = 200,
  customColors = { primary: '#06c9a1', secondary: '#007afc' },
  animationSpeed = 1,
  isPaused = false,
  reverse = false,
  autoScale = false,
  onAnimationComplete,
  fallback = <div className="brain-progress-loading">Loading...</div>,
  instantFill = false
}) => {
  // Calculate raw progress and clamp to [0,100]
  const rawProgress = useMemo(() => {
    if (value !== undefined && maxValue && maxValue > 0) {
      return Math.min(100, Math.max(0, (value / maxValue) * 100));
    }
    return totalPercent !== undefined ? Math.min(100, Math.max(0, totalPercent)) : 0;
  }, [totalPercent, value, maxValue]);
  
  // Convert raw progress to stepped progress (0, 25, 50, 75, 100)
  const steppedProgress = useMemo((): 0 | 25 | 50 | 75 | 100 => {
    if (rawProgress >= 100) return 100;
    if (rawProgress >= 75) return 75;
    if (rawProgress >= 50) return 50;
    if (rawProgress >= 25) return 25;
    return 0;
  }, [rawProgress]);

  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null); // GSAP timeline reference
  const prevPathsRef = useRef<string[]>([]);
  
  // Map each progress step to the paths that should be visible
  // The order is important - it determines the drawing sequence
  const pathIds = useMemo(() => {
    const pathSteps: Record<number, string[]> = {
      0: [],
      25: ["path-1"],
      // Include path-9 and path-10 at 50% progress
      50: ["path-1", "path-6", "path-9", "path-10"],
      75: ["path-1", "path-6", "path-9", "path-10", "path-5", "path-3", "path-2"],
      100: ["path-1", "path-6", "path-9", "path-10", "path-5", "path-3", "path-2", "path-4", "path-7", "path-8"]
    };
    return pathSteps[steppedProgress as keyof typeof pathSteps] || [];
  }, [steppedProgress]);

  // Apply auto-scaling if enabled
  useEffect(() => {
    if (autoScale && containerRef.current && svgRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current) {
          const { width, height } = containerRef.current.getBoundingClientRect();
          const minDimension = Math.min(width, height);
          
          if (svgRef.current) {
            svgRef.current.style.width = `${minDimension}px`;
            svgRef.current.style.height = `${minDimension}px`;
          }
        }
      });
      
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [autoScale]);

  // Initialize all paths with GSAP
  useEffect(() => {
    if (svgRef.current) {
      const allPaths = Array.from(svgRef.current.querySelectorAll('.brain-path'));
      
      // Set initial properties for all paths
      allPaths.forEach((pathElement) => {
        const path = pathElement as SVGPathElement;
        const pathLength = path.getTotalLength();
        
        // Set up GSAP initial state
        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          opacity: 0,
          fillOpacity: 0,
        });
      });
      
      setIsInitialRender(false);
      setIsLoading(false);
    }
  }, []);

  // Handle animation when progress changes
  useEffect(() => {
    if (isInitialRender || !svgRef.current) return;
    
    // Get all brain paths
    const allPaths = Array.from(svgRef.current.querySelectorAll('.brain-path'));
    
    // Special case: If we're at 100%, ensure all paths are visible
    const isFullProgress = steppedProgress === 100;
    
    // Handle instant fill case
    if (instantFill || isFullProgress) {
      allPaths.forEach((pathElement) => {
        const path = pathElement as SVGPathElement;
        const shouldBeVisible = pathIds.includes(path.id) || (isFullProgress && path.id.startsWith('path-'));
        
        gsap.to(path, {
          strokeDashoffset: shouldBeVisible ? 0 : path.getTotalLength(),
          opacity: shouldBeVisible ? 1 : 0,
          fillOpacity: shouldBeVisible ? 1 : 0,
          duration: instantFill ? 0 : 0.3,
          overwrite: true
        });
      });
      
      if (isFullProgress && onAnimationComplete) {
        onAnimationComplete();
      }
      return;
    }
    
    // Kill any existing animations
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    // Create a new timeline
    const tl = gsap.timeline({
      paused: isPaused,
      onComplete: () => {
        if (steppedProgress === 100 && onAnimationComplete) {
          onAnimationComplete();
        }
      }
    });
    
    // Calculate current visible paths and previously visible paths
    const currentPathIds = pathIds;
    const previousPathIds = prevPathsRef.current;
    
    // Store current paths for the next render
    prevPathsRef.current = [...currentPathIds];
    
    // Apply animations based on direction and visible paths
    if (reverse) {
      // For reverse animation, animate all paths out
      allPaths.forEach((pathElement, idx) => {
        const path = pathElement as SVGPathElement;
        const pathLength = path.getTotalLength();
        const isPathVisible = pathIds.includes(path.id);
        
        if (!isPathVisible) {
          // Path should not be visible in this state
          tl.to(path, {
            strokeDashoffset: pathLength,
            opacity: 0,
            fillOpacity: 0,
            duration: animationSpeed * 0.8,
            ease: "power2.inOut",
            delay: idx * 0.1 * animationSpeed
          }, idx * 0.05);
        }
      });
    } else {
      // Forward animation
      // Find new paths to add from current that weren't in previous
      const pathsToAdd = currentPathIds.filter(id => !previousPathIds.includes(id));
      
      // Animate new paths
      pathsToAdd.forEach((pathId, idx) => {
        const path = svgRef.current?.querySelector(`#${pathId}`) as SVGPathElement;
        if (path) {
          tl.to(path, {
            strokeDashoffset: 0,
            opacity: 1,
            fillOpacity: 1,
            duration: animationSpeed,
            ease: "power2.inOut",
            delay: idx * 0.2 * animationSpeed
          }, idx * 0.1);
        }
      });
      
      // Find paths to hide (paths that were visible before but aren't now)
      const pathsToHide = previousPathIds.filter(id => !currentPathIds.includes(id));
      
      // Animate paths that should no longer be visible
      pathsToHide.forEach((pathId, idx) => {
        const path = svgRef.current?.querySelector(`#${pathId}`) as SVGPathElement;
        if (path) {
          const pathLength = path.getTotalLength();
          tl.to(path, {
            strokeDashoffset: pathLength,
            opacity: 0,
            fillOpacity: 0,
            duration: animationSpeed * 0.5,
            ease: "power1.out",
            delay: idx * 0.1 * animationSpeed
          }, idx * 0.05);
        }
      });
    }
    
    // Store and play the timeline
    timelineRef.current = tl;
    if (!isPaused) {
      tl.play(0);
    }
  }, [steppedProgress, pathIds, isPaused, reverse, animationSpeed, instantFill, isInitialRender, onAnimationComplete]);
  
  // Handle pause state changes
  useEffect(() => {
    if (timelineRef.current) {
      if (isPaused) {
        timelineRef.current.pause();
      } else {
        timelineRef.current.play();
      }
    }
  }, [isPaused]);
  
  // Main render function
  // Format the percentage for display
  const percentage = Math.round(rawProgress);
  
  return (
    <div 
      ref={containerRef}
      className="brain-progress-container"
      style={{ 
        width: width, 
        height: height,
        backgroundColor: backgroundColor 
      }}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      data-progress={steppedProgress}
      data-paused={isPaused}
      data-reverse={reverse}
    >
      {isLoading ? (
        <Suspense fallback={fallback}>
          {fallback}
        </Suspense>
      ) : (
        <svg 
          ref={svgRef} 
          className="brain-progress-svg" 
          viewBox="0 0 1000 1000" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Define gradient for the brain parts */}
          <defs>
            <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={customColors.primary} />
              <stop offset="100%" stopColor={customColors.secondary} />
            </linearGradient>
          </defs>
          
          {/* brain stem path */}
          <path 
            id="path-1" 
            className="brain-path" 
            d="M500,700 C500,700 500,750 500,800 C500,850 450,900 400,900 C350,900 300,850 300,800"
            stroke="url(#brain-gradient)"
          />
          
          {/* left lobe lower path */}
          <path 
            id="path-2" 
            className="brain-path" 
            d="M300,800 C250,750 200,700 200,600 C200,500 250,450 300,400"
            stroke="url(#brain-gradient)"
          />
          
          {/* left lobe upper path */}
          <path 
            id="path-3" 
            className="brain-path" 
            d="M300,400 C350,350 400,300 500,300"
            stroke="url(#brain-gradient)"
          />
          
          {/* right lobe upper path */}
          <path 
            id="path-4" 
            className="brain-path" 
            d="M500,300 C600,300 650,350 700,400"
            stroke="url(#brain-gradient)"
          />
          
          {/* right lobe lower path */}
          <path 
            id="path-5" 
            className="brain-path" 
            d="M700,400 C750,450 800,500 800,600 C800,700 750,750 700,800"
            stroke="url(#brain-gradient)"
          />
          
          {/* right bottom connection path */}
          <path 
            id="path-6" 
            className="brain-path" 
            d="M700,800 C650,850 600,900 550,900 C500,900 500,850 500,800"
            stroke="url(#brain-gradient)"
          />
          
          {/* cerebellum lower left path */}
          <path 
            id="path-7" 
            className="brain-path" 
            d="M300,600 C250,550 200,500 150,500 C100,500 50,550 50,600 C50,650 100,700 150,700 C200,700 250,650 300,600"
            stroke="url(#brain-gradient)"
          />
          
          {/* cerebellum lower right path */}
          <path 
            id="path-8" 
            className="brain-path" 
            d="M700,600 C750,650 800,700 850,700 C900,700 950,650 950,600 C950,550 900,500 850,500 C800,500 750,550 700,600"
            stroke="url(#brain-gradient)"
          />
          
          {/* left mid connection */}
          <path 
            id="path-9" 
            className="brain-path" 
            d="M400,600 C350,550 300,500 250,500 C200,500 150,550 150,600 C150,650 200,700 250,700 C300,700 350,650 400,600"
            stroke="url(#brain-gradient)"
          />
          
          {/* right mid connection */}
          <path 
            id="path-10" 
            className="brain-path" 
            d="M600,600 C650,550 700,500 750,500 C800,500 850,550 850,600 C850,650 800,700 750,700 C700,700 650,650 600,600"
            stroke="url(#brain-gradient)"
          />
          
          {/* Add percentage label */}
          {showLabel && (
            <g>
              <circle cx="500" cy="500" r="80" fill="rgba(255,255,255,0.8)" />
              <text
                className="brain-progress-text"
                x="500"
                y="500"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="#333"
                fontSize="40"
                fontWeight="bold"
              >
                {percentage}%
              </text>
            </g>
          )}
        </svg>
      )}
    </div>
  );
};

export default BrainProgress;