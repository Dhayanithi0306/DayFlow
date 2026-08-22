import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error Boundary Catch:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel rounded-2xl p-8 border border-red-500/20 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Something went wrong</h2>
              <p className="text-sm text-slate-400 mt-2">
                {this.state.error?.message || 'An unexpected error occurred in the application interface.'}
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-sky-600/20"
            >
              <RefreshCw size={18} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
