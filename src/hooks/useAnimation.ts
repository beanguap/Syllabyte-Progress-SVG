import { useCallback } from 'react';

interface AnimationProperties {
  [key: string]: string | number;
}

export const useAnimation = (duration: number) => {
  const animate = useCallback((
    element: HTMLElement,
    properties: AnimationProperties,
    delay = 0
  ) => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        Object.entries(properties).forEach(([key, value]) => {
          // Use setProperty to safely update CSS values
          element.style.setProperty(key, String(value));
        });
      });
    }, delay * duration);
  }, [duration]);
  
  return { animate };
};
