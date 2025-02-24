# My Brain Progress

A React + TypeScript application featuring a custom **BrainProgress** component with an animated "unwinding" effect using an SVG brain logo.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Scripts](#scripts)
- [Customization](#customization)
- [Documentation](#documentation)
- [License](#license)

## Overview

My Brain Progress is built with [Vite](https://vitejs.dev/) to take advantage of fast, modern development tooling. The core highlight of this project is the **BrainProgress** component, which displays a visually appealing loading/unwinding animation on an SVG brain logo to indicate progress.

## Features

- **SVG-Based Animation:** An unwinding animation that updates dynamically based on progress percentage.
- **TypeScript Support:** Strongly typed components for reliability and maintainability.
- **Responsive Design:** The component adapts to various screen sizes and dimensions.
- **Multiple Progress Input Options:** Accepts a direct percentage or calculates progress as `(value / maxValue) * 100`.
- **Customizable Styles:** Easily change colors, stroke widths, or backgrounds.
- **Accessibility:** Provides proper ARIA labels and attributes.

In your project root, you have access to these NPM scripts:

    npm run dev: Starts the development server.
    npm run build: Builds the application for production.
    npm run preview: Locally previews the production build.

## Customization

    BrainProgress Props
        totalPercent?: number; – Directly set the progress percentage.
        value?: number; maxValue?: number; – Calculate progress as (value / maxValue) * 100.
        backgroundColor?: string; – Background track color.
        showLabel?: boolean; – Toggles display of the percentage label.
        width?: number; height?: number; – Dimensions of the SVG container.
        customColors?: { primary?: string; secondary?: string }; – Color theme for the progress stroke and label.
        animationSpeed?: number; – Duration (in seconds) of the progress animation.

Feel free to modify the SVG paths and animations to achieve the exact “unwinding” effect shown in the storyboard.

## Documentation

For further details, refer to the following documents in the src/docs/ folder:

    SVG Brain Logo Animation.docx – Detailed functional and visual requirements.
    SVG Brain Storyboard Unwind.pdf – Visual storyboard of the “unwinding” animation.


For any questions or suggestions, please open an issue or submit a pull request.