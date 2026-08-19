import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#fff', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Une erreur est survenue</h1>
          <p style={{ color: '#aaa', marginBottom: 20, maxWidth: 400 }}>
            {this.state.error.message || 'Erreur inconnue'}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
            style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#5b7cfa', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
          >
            Retour à l'accueil
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
