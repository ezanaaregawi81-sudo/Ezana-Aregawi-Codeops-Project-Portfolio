import { Component } from "react";

export function RouteLoadingFallback({ label = "Loading page..." }) {
  return (
    <section className="page menu">
      <div className="route-skeleton" aria-live="polite" aria-busy="true">
        <div className="skeleton-block skeleton-title" />
        <div className="skeleton-block skeleton-line" />
        <div className="skeleton-block skeleton-line short" />
        <div className="skeleton-block skeleton-line" />
      </div>
      <p className="loading-state">{label}</p>
    </section>
  );
}

export function RouteErrorFallback({ title, message, onReset }) {
  return (
    <section className="page menu">
      <div className="error-state" role="alert">
        <h3>{title}</h3>
        <p>{message}</p>
        {onReset ? (
          <button type="button" className="secondary-btn" onClick={onReset}>
            Try again
          </button>
        ) : null}
      </div>
    </section>
  );
}

export class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Route boundary caught an error", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <RouteErrorFallback
            title={this.props.title || "Something went wrong"}
            message={this.props.message || "This section could not load."}
            onReset={this.reset}
          />
        )
      );
    }

    return this.props.children;
  }
}
