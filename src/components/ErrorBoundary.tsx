'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#e8e0d0', fontFamily: "'Caveat', cursive", fontSize: 24, color: '#666',
          flexDirection: 'column', gap: 16,
        }}>
          <div style={{ fontSize: 48 }}>:|</div>
          <div>3D canvas unavailable</div>
          <div style={{ fontSize: 16, color: '#999' }}>Try a different browser or enable WebGL</div>
        </div>
      );
    }
    return this.props.children;
  }
}
