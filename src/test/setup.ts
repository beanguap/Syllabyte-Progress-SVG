import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Define missing methods with proper type assertions
interface SVGElementWithExtensions extends SVGElement {
  getTotalLength: () => number;
  getBBox: () => { 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    toString: () => string;
    toJSON: () => Record<string, unknown>;
  };
}

// Apply extensions to SVGElement prototype
Object.defineProperty(SVGElement.prototype, 'getTotalLength', {
  value: function() { return 100; },
  configurable: true
});

Object.defineProperty(SVGElement.prototype, 'getBBox', {
  value: function() {
    return {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      toString: () => '',
      toJSON: () => ({})
    };
  },
  configurable: true
});

// Enhance querySelector with type safety
const originalQuerySelector = document.querySelector;
document.querySelector = function(selector: string) {
  const result = originalQuerySelector.call(this, selector);
  if (selector.includes('#path-') && !result) {
    const mockPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mockPath.id = selector.replace('#', '');
    mockPath.classList.add('brain-path');
    document.body.appendChild(mockPath);
    return mockPath;
  }
  return result;
};

// Mock the ResizeObserver which isn't available in test environment
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Apply mock globally
(global as any).ResizeObserver = MockResizeObserver;

// FIX: Properly mock requestAnimationFrame and cancelAnimationFrame with correct types
// Use a map to track timeouts by their numeric IDs
const timeoutMap = new Map<number, NodeJS.Timeout>();
let nextRequestId = 0;

// Mock requestAnimationFrame to return a number ID as expected
global.requestAnimationFrame = function(callback: FrameRequestCallback): number {
  const requestId = ++nextRequestId;
  const timeout = setTimeout(() => callback(Date.now()), 0);
  timeoutMap.set(requestId, timeout);
  return requestId;
};

// Mock cancelAnimationFrame to clear the associated timeout
global.cancelAnimationFrame = function(requestId: number): void {
  const timeout = timeoutMap.get(requestId);
  if (timeout) {
    clearTimeout(timeout);
    timeoutMap.delete(requestId);
  }
};

afterEach(() => {
  cleanup();
  // Remove mock elements after each test
  document.querySelectorAll('.brain-path').forEach(el => el.remove());
  
  // Clear any remaining animation frame timeouts
  timeoutMap.forEach(timeout => clearTimeout(timeout));
  timeoutMap.clear();
});

// Silence console messages during tests
console.error = vi.fn();
console.warn = vi.fn();