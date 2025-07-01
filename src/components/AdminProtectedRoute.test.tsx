import { render, screen } from '@testing-library/react';
import AdminProtectedRoute from './AdminProtectedRoute';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { vi } from 'vitest';

// Helper to set Zustand auth state
const setAuthState = (auth: Partial<ReturnType<typeof useAuthStore.getState>>) => {
  useAuthStore.setState(auth);
};

describe('AdminProtectedRoute', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({ isInitialized: false, isAuthenticated: false });
  });

  it('shows loading when not initialized', () => {
    setAuthState({ isInitialized: false, isAuthenticated: false });
    render(
      <MemoryRouter>
        <AdminProtectedRoute>child</AdminProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
  });

  it('redirects to /admin-login if not authenticated', () => {
    setAuthState({ isInitialized: true, isAuthenticated: false });
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AdminProtectedRoute>child</AdminProtectedRoute>
      </MemoryRouter>
    );
    // Should render nothing, as Navigate will redirect
    expect(screen.queryByText('child')).not.toBeInTheDocument();
  });

  it('renders children if authenticated and initialized', () => {
    setAuthState({ isInitialized: true, isAuthenticated: true });
    render(
      <MemoryRouter>
        <AdminProtectedRoute>child</AdminProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });
}); 