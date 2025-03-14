import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { BrainProgressProps } from './types';
import './BrainProgress.css';

/**
 * AnimationCycleExample - A simplified component that shows the brain SVG
 * with automated fill-pause-drain-pause cycle animation
 */
const AnimationCycleExample: React.FC<Omit<BrainProgressProps, 'totalPercent' | 'value' | 'maxValue'>> = ({
  showLabel = true,
  width = 300,
  height = 300,
  customColors = { primary: '#06c9a1', secondary: '#007afc' },
  animationSpeed = 1.5
}) => {
  // Progress percentage for display and ARIA
  const [progressPercent, setProgressPercent] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // Set up the GSAP animation sequence - no interactive controls
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clean up existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    // Get all brain paths
    const paths = Array.from(svgRef.current.querySelectorAll('.brain-path'));
    
    // Initialize all paths to be invisible
    gsap.set(paths, { opacity: 0, fillOpacity: 0 });
    
    // Create a timeline for the animation sequence
    const timeline = gsap.timeline({
      repeat: -1,
      onUpdate: () => {
        const calculatedProgress = Math.round(timeline.progress() * 100);
        setProgressPercent(calculatedProgress);
      }
    });
    
    // Define the animation sequence based on the storyboard
    const animationOrder = [
      "path-4",   // Top arc (first to appear)
      "path-5",   // Right side curve 
      "path-1",   // Bottom right connection
      "path-9",   // Left side connection
      "path-10",  // Small inner detail
      "path-2",   // Right node
      "path-3",   // Another node
      "path-6",   // Complex right side
      "path-7",   // Upper right detail
      "path-8"    // Final upper right detail
    ];
    
    // Create a fill timeline
    const fillTimeline = gsap.timeline();
    
    // Add animations for each path to appear
    animationOrder.forEach((pathId, index) => {
      const path = svgRef.current?.querySelector(`#${pathId}`);
      if (path) {
        fillTimeline.to(path, {
          opacity: 1,
          fillOpacity: 1,
          duration: animationSpeed * 0.6,
          ease: "power1.inOut"
        }, index * (animationSpeed * 0.15));
      }
    });
    
    // Add a pause at 100% filled
    fillTimeline.to({}, { duration: 1 });
    
    // Create a drain timeline
    const drainTimeline = gsap.timeline();
    
    // Add animations for each path to disappear in reverse order
    [...animationOrder].reverse().forEach((pathId, index) => {
      const path = svgRef.current?.querySelector(`#${pathId}`);
      if (path) {
        drainTimeline.to(path, {
          opacity: 0,
          fillOpacity: 0,
          duration: animationSpeed * 0.6,
          ease: "power1.inOut"
        }, index * (animationSpeed * 0.15));
      }
    });
    
    // Add a pause at 0% filled
    drainTimeline.to({}, { duration: 0.5 });
    
    // Add both timelines to the main sequence
    timeline.add(fillTimeline).add(drainTimeline);
    
    // Store reference and immediately play the animation
    timelineRef.current = timeline;
    timeline.play(0);
    
    // Clean up on unmount
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [animationSpeed]);
  
  return (
    <div 
      className="brain-progress-container"
      style={{ 
        width, 
        height,
        position: 'relative',
        overflow: 'visible'
      }}
    >
      <svg 
        ref={svgRef} 
        className="brain-progress-svg" 
        viewBox="0 0 1000 1000" 
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Define gradient for the brain parts */}
        <defs>
          <linearGradient id="linear-gradient" x1="664.31" y1="867.94" x2="615.23" y2="818.86" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={customColors.primary}/>
            <stop offset="1" stopColor={customColors.secondary}/>
          </linearGradient>
          <linearGradient id="linear-gradient-2" x1="773.96" y1="488.8" x2="654.86" y2="488.8" xlinkHref="#linear-gradient"/>
          <linearGradient id="linear-gradient-3" x1="773.96" y1="480.15" x2="654.86" y2="480.15" xlinkHref="#linear-gradient"/>
          <linearGradient id="linear-gradient-4" x1="652.24" y1="156.17" x2="108.15" y2="260.53" xlinkHref="#linear-gradient"/>
          <linearGradient id="linear-gradient-5" x1="738.05" y1="438.05" x2="284.05" y2="469.27" xlinkHref="#linear-gradient"/>
          <linearGradient id="linear-gradient-6" x1="762.98" y1="536.47" x2="597.97" y2="648.86" xlinkHref="#linear-gradient"/>
          <linearGradient id="linear-gradient-7" x1="746.41" y1="212.32" x2="914.99" y2="380.9" xlinkHref="#linear-gradient"/>
          <linearGradient id="linear-gradient-8" x1="742.14" y1="216.58" x2="910.71" y2="385.15" xlinkHref="#linear-gradient"/>
          <linearGradient id="linear-gradient-9" x1="298.5" y1="665.37" x2="422.48" y2="534.26" xlinkHref="#linear-gradient"/>
        </defs>
        
        {/* Paths from the Syllabyte.svg */}
        <path 
          id="path-1"
          className="brain-path" 
          d="M641.22,896.98c-11.97,0-23.26-7.29-27.76-19.15-11.15-29.17-50.64-109.64-98.7-131.12-14.97-6.69-21.68-24.25-14.99-39.23,6.7-14.97,24.26-21.68,39.23-14.99,79.09,35.35,125,151.15,129.97,164.24,5.83,15.33-1.88,32.48-17.2,38.31-3.47,1.32-7.04,1.95-10.55,1.95Z"
          fill="url(#linear-gradient)" 
          strokeWidth="0"
        />
        
        <path 
          id="path-2"
          className="brain-path" 
          d="M767.07,518.5c-.83,0-1.66-.03-2.5-.1-.69-.06-1.43-.15-2.12-.25-16.21-2.49-27.33-17.66-24.83-33.87,2.46-15.97,17.23-26.98,33.14-24.94,15.7,1.97,27.19,16.01,25.87,31.93-1.29,15.5-14.28,27.23-29.56,27.23Z"
          fill="url(#linear-gradient-2)" 
          strokeWidth="0"
        />
        
        <path 
          id="path-3"
          className="brain-path" 
          d="M688.96,510.71c-.77,0-1.54-.03-2.32-.09-8.06-.62-16.39-1.21-24.76-1.7-16.37-.97-28.86-15.03-27.88-31.4.98-16.37,15.09-28.86,31.4-27.88,8.24.49,16.93,1.09,25.83,1.78,16.35,1.27,28.58,15.55,27.31,31.9-1.21,15.57-14.22,27.4-29.57,27.4Z"
          fill="url(#linear-gradient-3)" 
          strokeWidth="0"
        />
        
        <path 
          id="path-4"
          className="brain-path" 
          d="M681.84,175.61c-6.01,15.27-23.2,22.81-38.5,16.84-50.97-19.95-107.84-30.04-169.08-30.04-177.12,0-294.43,63.93-345.15,123.77-22.57,26.62-33.82,54.53-31.13,77.03l-58.38,11.25c-6.43-40.52,9.26-85.48,44.19-126.71,76.86-90.62,222.81-144.73,390.46-144.73,68.68,0,132.82,11.46,190.74,34.13,15.27,5.97,22.81,23.2,16.84,38.46Z"
          fill="url(#linear-gradient-4)" 
          strokeWidth="0"
        />
        
        <path 
          id="path-5"
          className="brain-path" 
          d="M954.71,542.01l-55.69-20.65c11.91-32.14-7.97-73.71-44.33-92.68-95.79-49.96-351.62-29.8-536.77,42.31-78.25,30.46-155.07,29.73-210.87-2.03-36.89-21-60.79-54.25-67.35-93.69-.03-.28-.07-.52-.1-.8l58.38-11.25c.07.8.17,1.57.31,2.34,4.58,27.46,23.27,43.32,38.15,51.81,39.58,22.53,99.35,21.87,159.93-1.71,179.21-69.8,463.86-103.23,585.82-39.62,62.95,32.84,94.81,105.75,72.52,165.97Z"
          fill="url(#linear-gradient-5)" 
          strokeWidth="0"
        />
        
        <path 
          id="path-6"
          className="brain-path" 
          d="M805.47,634.79c15.13,16.52,24.98,36.44,25.75,60.3,1.05,32.35-15.34,59.84-46.15,77.42-25.54,14.6-60.12,21.59-97.75,21.59-59.11,0-125.69-17.26-176.35-49.43-72.56-46.04-109.66-121.5-92.23-187.7,7.97-30.39,40.63-101.8,170.83-108.51l1.64-.07c16.38-.73,30.29,11.88,31.06,28.26.77,16.35-11.88,30.29-28.26,31.06l-1.4.07c-64.14,3.28-106.59,26.72-116.44,64.28-10.66,40.45,16.77,90.83,66.62,122.48,69.07,43.84,171.14,50.2,212.86,26.41,14.78-8.45,16.42-17.26,16.21-23.97-.94-29.69-51.88-54.18-104.66-68.58-19.39-3.11-40.03-7.2-62.11-12.33-15.37-3.6-25.26-18.55-22.5-34.1,2.76-15.55,17.19-26.2,32.87-24.31,7.2.91,32.91,4.4,64.21,12.61,138.86,21.87,204.51-8.91,219.35-48.91l55.69,20.65c-10.83,29.21-44.79,81.64-149.24,92.79Z"
          fill="url(#linear-gradient-6)" 
          strokeWidth="0"
        />
        
        <path 
          id="path-7"
          className="brain-path" 
          d="M786.07,277.8c-7.35,0-14.71-2.71-20.46-8.18-12.45-11.84-25.98-22.96-40.2-33.05-13.38-9.49-16.53-28.02-7.04-41.4,9.49-13.38,28.03-16.53,41.4-7.05,16.53,11.72,32.27,24.66,46.77,38.46,11.89,11.3,12.36,30.1,1.05,41.98-5.84,6.14-13.67,9.23-21.52,9.23Z"
          fill="url(#linear-gradient-7)" 
          strokeWidth="0"
        />
        
        <path 
          id="path-8"
          className="brain-path" 
          d="M841.09,345.25c-10.63,0-20.89-5.73-26.22-15.72-7.78-14.34-2.53-32.29,11.78-40.17,14.36-7.92,32.42-2.68,40.34,11.68.14.25.37.67.49.92,7.5,14.58,1.76,32.49-12.82,39.99-4.35,2.23-8.99,3.29-13.56,3.29Z"
          fill="url(#linear-gradient-8)" 
          strokeWidth="0"
        />
        
        <path 
          id="path-10"
          className="brain-path" 
          d="M425.54,697.51c-3-16.12-18.42-26.77-34.55-23.78l4.84,29.3-4.88-29.29c-16.18,2.7-27.1,18-24.41,34.17,2.42,14.52,15,24.82,29.26,24.82,1.62,0,3.26-.13,4.92-.41l1-.18c16.12-3,26.84-18.51,23.83-34.64Z"
          fill={customColors.primary}
          strokeWidth="0"
        />
        
        <path 
          id="path-9"
          className="brain-path" 
          d="M308.6,720.68c-4.03,0-8.11-.82-12.03-2.56-45.96-20.4-69.97-57.7-67.6-105.03,7.09-141.81,255.17-162.4,361.5-164.67,16.36-.43,29.97,12.66,30.32,29.05.35,16.4-12.66,29.97-29.05,30.32-84.34,1.8-160.4,12.9-214.15,31.24-39.66,13.53-87.34,37.88-89.3,77.02-.76,15.22,2.23,34.4,32.38,47.78,14.99,6.65,21.75,24.2,15.09,39.19-4.91,11.07-15.77,17.65-27.16,17.65Z"
          fill="url(#linear-gradient-9)" 
          strokeWidth="0"
        />
        
        {/* Add percentage label */}
        {showLabel && (
          <g className="brain-progress-label">
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
              {progressPercent}%
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default AnimationCycleExample; 