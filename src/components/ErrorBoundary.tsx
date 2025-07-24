"use client"
import React from 'react';


export class ErrorBoundary extends React.Component {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }; // Update state to show fallback UI.
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("Error occurred:", error, info); // Log error details.
  }

  render() {
    // @ts-expect-error
    if (this.state.hasError) {
    // @ts-expect-error
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }
    // @ts-expect-error
    return this.props.children; // Render child components if no error.
  }
}
