import { render, screen } from '@testing-library/react';
import EducatorProtectedRoute from './EducatorProtectedRoute';
import * as useAuthModule from '../hooks/useAuth';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Helper to mock useAuth
const mockUseAuth = (auth: Partial<ReturnType<typeof useAuthModule.useAuth>>) => {
  vi.spyOn(useAuthModule, 'useAuth').mockReturnValue(auth as any);
};

describe('EducatorProtectedRoute', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading when not initialized', () => {
    mockUseAuth({ isInitialized: false, isAuthenticated: false });
    render(
      <MemoryRouter>
        <EducatorProtectedRoute>child</EducatorProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to /educator-login if not authenticated', () => {
    mockUseAuth({ isInitialized: true, isAuthenticated: false });
    render(
      <MemoryRouter initialEntries={["/educator"]}>
        <EducatorProtectedRoute>child</EducatorProtectedRoute>
      </MemoryRouter>
    );
    // Should render nothing, as Navigate will redirect
    expect(screen.queryByText('child')).not.toBeInTheDocument();
  });

  it('renders children if authenticated and initialized', () => {
    mockUseAuth({ isInitialized: true, isAuthenticated: true });
    render(
      <MemoryRouter>
        <EducatorProtectedRoute>child</EducatorProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });
}); 