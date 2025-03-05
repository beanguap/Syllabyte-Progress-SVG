/**
 * Animation utility functions
 */

// Store brain progress state in sessionStorage to persist across refreshes
export const persistBrainState = {
  saveProgress: (id: string, progress: number): void => {
    try {
      sessionStorage.setItem(`brain_progress_${id}`, String(progress));
    } catch (err) {
      console.warn('Could not save progress to sessionStorage', err);
    }
  },

  getProgress: (id: string, defaultValue: number = 0): number => {
    try {
      const saved = sessionStorage.getItem(`brain_progress_${id}`);
      return saved ? Number(saved) : defaultValue;
    } catch (err) {
      console.warn('Could not retrieve progress from sessionStorage', err);
      return defaultValue;
    }
  }
};

// Utility for smooth animations
export const animationHelpers = {
  // Prevent animation flash by staggering fade-out
  staggeredFadeOut: (
    elements: HTMLElement[] | SVGElement[], 
    duration: number = 1.0,
    options?: { 
      baseDelay?: number, 
      delayIncrement?: number, 
      reverse?: boolean 
    }
  ): void => {
    const {
      baseDelay = 0,
      delayIncrement = 0.1,
      reverse = false
    } = options || {};
    
    const elementsToAnimate = reverse ? [...elements].reverse() : elements;
    
    elementsToAnimate.forEach((el, i) => {
      const delay = baseDelay + (i * delayIncrement);
      
      // Apply staggered transitions
      el.style.transition = `
        opacity ${duration}s ease-out ${delay}s,
        fill-opacity ${duration * 1.2}s ease-out ${delay * 0.8}s
      `;
      
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.fillOpacity = '0';
      }, delay * 1000);
    });
  }
};
