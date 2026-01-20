import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
  retryButton?: boolean
  onRetry?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: any
  componentName: string
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      componentName: props.componentName || 'Component',
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`Error in ${this.state.componentName}:`, error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className='rounded-lg border border-red-200 bg-red-50 p-4 my-4'>
            <h3 className='text-lg font-medium text-red-800 mb-2'>
              {this.state.componentName} unavailable
            </h3>
            <p className='text-sm text-red-600'>
              An error occurred while loading data. The service may be
              temporarily unavailable.
            </p>
            {this.props.retryButton && (
              <button
                onClick={this.props.onRetry}
                className='mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded'
              >
                Try again
              </button>
            )}
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
