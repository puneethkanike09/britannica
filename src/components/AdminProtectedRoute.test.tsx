import { render, screen } from '@testing-library/react';
import AdminProtectedRoute from './AdminProtectedRoute';
import * as useAuthModule from '../hooks/useAuth';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Helper to mock useAuth
const mockUseAuth = (auth: Partial<ReturnType<typeof useAuthModule.useAuth>>) => {
  vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(auth as any);
};

describe('AdminProtectedRoute', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading when not initialized', () => {
    mockUseAuth({ isInitialized: false, isAuthenticated: false });
    render(
      <MemoryRouter>
        <AdminProtectedRoute>child</AdminProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
  });

  it('redirects to /admin-login if not authenticated', () => {
    mockUseAuth({ isInitialized: true, isAuthenticated: false });
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AdminProtectedRoute>child</AdminProtectedRoute>
      </MemoryRouter>
    );
    // Should render nothing, as Navigate will redirect
    expect(screen.queryByText('child')).not.toBeInTheDocument();
  });

  it('renders children if authenticated and initialized', () => {
    mockUseAuth({ isInitialized: true, isAuthenticated: true });
    render(
      <MemoryRouter>
        <AdminProtectedRoute>child</AdminProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });
}); 