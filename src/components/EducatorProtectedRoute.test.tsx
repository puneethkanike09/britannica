import { render, screen } from '@testing-library/react';
import EducatorProtectedRoute from './EducatorProtectedRoute';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { vi } from 'vitest';

// Helper to set Zustand auth state
const setAuthState = (auth: Partial<ReturnType<typeof useAuthStore.getState>>) => {
  useAuthStore.setState(auth);
};

describe('EducatorProtectedRoute', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({ isInitialized: false, isAuthenticated: false });
  });

  it('shows loading when not initialized', () => {
    setAuthState({ isInitialized: false, isAuthenticated: false });
    render(
      <MemoryRouter>
        <EducatorProtectedRoute>child</EducatorProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
  });

  it('redirects to /educator-login if not authenticated', () => {
    setAuthState({ isInitialized: true, isAuthenticated: false });
    render(
      <MemoryRouter initialEntries={["/educator"]}>
        <EducatorProtectedRoute>child</EducatorProtectedRoute>
      </MemoryRouter>
    );
    // Should render nothing, as Navigate will redirect
    expect(screen.queryByText('child')).not.toBeInTheDocument();
  });

  it('renders children if authenticated and initialized', () => {
    setAuthState({ isInitialized: true, isAuthenticated: true });
    render(
      <MemoryRouter>
        <EducatorProtectedRoute>child</EducatorProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });
}); 