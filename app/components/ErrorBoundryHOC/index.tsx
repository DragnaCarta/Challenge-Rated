import React, { Component, ComponentType } from 'react';

// Define the HOC function with proper typing
const withErrorBoundary = <P extends object>(WrappedComponent: ComponentType<P>) => {
    // Create a class component that extends React.Component
    return class ErrorBoundaryHOC extends Component<P, { hasError: boolean; errorMessage: string }> {
        // Define the state shape
        state = { hasError: false, errorMessage: '' };

        // This lifecycle method is called when an error occurs in a child component
        static getDerivedStateFromError(error: Error) {
            return { hasError: true, errorMessage: error.message };
        }

        // Logs the error, useful for services like Sentry
        componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
            console.error('Error caught by HOC:', error, errorInfo);
            alert(`An error occurred: ${error.message}`);
        }

        // Render method to display fallback UI if an error occurs, otherwise render WrappedComponent
        render() {
            return <WrappedComponent {...(this.props as P)} />;
        }
    };
};

export default withErrorBoundary;
