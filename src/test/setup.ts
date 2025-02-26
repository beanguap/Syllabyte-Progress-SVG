import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock SVGPathElement.getTotalLength for all SVG elements in JSDOM
SVGElement.prototype.getTotalLength = () => 100;

afterEach(() => {
  cleanup();
});