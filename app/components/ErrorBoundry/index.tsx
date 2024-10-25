'use client'
import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    errorMessage: string;
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {
        hasError: false,
        errorMessage: '',
    };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error.message);
        alert(`An error occurred: ${error.message}`);
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;
