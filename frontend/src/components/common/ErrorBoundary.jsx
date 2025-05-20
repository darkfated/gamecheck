import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      componentName: props.componentName || 'Компонент'
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Ошибка в ${this.state.componentName}:`, error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 my-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            {this.state.componentName} недоступен
          </h3>
          <p className="text-sm text-red-600">
            Произошла ошибка при загрузке данных. Возможно, сервис временно недоступен.
          </p>
          {this.props.retryButton && (
            <button 
              onClick={this.props.onRetry}
              className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded"
            >
              Попробовать снова
            </button>
          )}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
