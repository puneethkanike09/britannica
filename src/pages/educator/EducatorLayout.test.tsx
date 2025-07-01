import { render, screen } from '@testing-library/react';
import EducatorLayout from './EducatorLayout';
import { vi } from 'vitest';

// Mock react-router-dom's Outlet
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">OutletContent</div>,
  };
});

describe('EducatorLayout', () => {
  it('renders the layout and Outlet', () => {
    render(<EducatorLayout />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByText('OutletContent')).toBeInTheDocument();
  });
}); 