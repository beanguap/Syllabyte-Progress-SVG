# Syllabyte-Progress-SVG

A React + TypeScript application featuring a custom **BrainProgress** component that displays an animated "unwinding" effect using an SVG brain logo.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Testing & Integration](#testing--integration)
- [Performance Optimizations](#performance-optimizations)
- [Customization](#customization)
- [Documentation](#documentation)
- [License](#license)

## Overview

Syllabyte-Progress-SVG leverages [Vite](https://vitejs.dev/) for modern development tooling. The core component, **BrainProgress**, provides a visually appealing progress indicator using an animated SVG brain that "unwinds" as progress increases.

## Features

- **Dynamic SVG Animation:** Brain logo progressively "unwinds" based on progress
- **TypeScript Integration:** Full type safety and improved developer experience
- **Responsive Design:** Adapts seamlessly to different screen sizes
- **Flexible Progress Input:** Use direct percentage or value/maxValue calculation
- **Custom Styling:** Configurable colors, dimensions, and animation speeds
- **Accessibility:** ARIA compliant with proper labels and roles
- **Performance Optimized:** GPU-accelerated animations and React optimizations
- **Comprehensive Testing:** Unit and integration tests using Vitest

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

4. Build for production:
```bash
npm run build
npm run preview
```

## Project Structure

    .gitignore
    eslint.config.js
    index.html
    package.json
    public/
      vite.svg
    README.md
    src/
      App.test.tsx
      App.tsx
      assets/
        images/
          Progress 0%.png
          Progress 25%.png
          Progress 50%.png
          Progress 100%.png
          ...
        Syllabyte.svg
      components/
        BrainProgress.test.tsx
        BrainProgress.tsx
      docs/
        SVG Brain Logo Animation.docx
        SVG Brain Storyboard Unwind.pdf
      main.tsx
      styles/
        BrainProgress.css
      test/
        setup.ts
      vite-env.d.ts
    tsconfig.app.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts

## Usage

Import and use the BrainProgress component:

```tsx
import { BrainProgress } from './components/BrainProgress';

function App() {
  return (
    <BrainProgress
      value={75}
      maxValue={100}
      showLabel={true}
      animationSpeed={1.5}
      customColors={{
        primary: '#06c9a1',
        secondary: '#007afc'
      }}
    />
  );
}
```

## Testing & Integration

The project uses Vitest with React Testing Library:

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

Test files are located in:
- `src/components/BrainProgress.test.tsx` - Unit tests
- `src/App.test.tsx` - Integration tests
- `src/test/setup.ts` - Test configuration

## Performance Optimizations

- **GPU Acceleration:** Uses CSS transform and opacity for smooth animations
- **RAF Implementation:** Leverages requestAnimationFrame for optimal updates
- **Memoization:** Optimizes calculations with useMemo
- **Lazy Loading:** Support for React.lazy and Suspense

## Customization

Available props for BrainProgress:

```typescript
interface BrainProgressProps {
  totalPercent?: number;              // Direct percentage value
  value?: number;                     // Current progress value
  maxValue?: number;                  // Maximum progress value
  backgroundColor?: string;           // Background color
  showLabel?: boolean;                // Show percentage label
  width?: number;                     // Component width
  height?: number;                    // Component height
  customColors?: {                    // Gradient colors
    primary?: string;
    secondary?: string;
  };
  animationSpeed?: number;            // Animation duration in seconds
}
```

## Documentation

Additional documentation in `src/docs/`:
- `SVG Brain Logo Animation.docx` - Functional requirements
- `SVG Brain Storyboard Unwind.pdf` - Animation storyboard

Developer:

https://x.com/Pybeancoder

MIT License. See [LICENSE](LICENSE) for details.
