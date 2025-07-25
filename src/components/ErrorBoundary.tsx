"use client";
import React from "react";


export class ErrorBoundary extends React.Component {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true }; // Update state to show fallback UI.
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("Error occurred:", error, info); // Log error details.
  }

  render() {
    // @ts-expect-error Inconsistent return type
    if (this.state.hasError) {
    // @ts-expect-error Inconsistent return type
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }
    // @ts-expect-error Inconsistent return type
    return this.props.children;
  }
}
