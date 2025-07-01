import { render, screen, act } from '@testing-library/react';
import AdminLayout from './AdminLayout';
import { vi } from 'vitest';

// Mock Sidebar and Topbar
vi.mock('./components/layout/sidebar', () => ({
  __esModule: true,
  default: ({ showLogoutModal, onCloseLogoutModal, isCollapsed, onToggleCollapse }: any) => (
    <div data-testid="sidebar">
      <button onClick={onToggleCollapse}>Toggle</button>
      <span>{isCollapsed ? 'Collapsed' : 'Expanded'}</span>
      <span>{showLogoutModal ? 'LogoutModalOpen' : 'LogoutModalClosed'}</span>
      <button onClick={onCloseLogoutModal}>CloseLogout</button>
    </div>
  ),
}));
vi.mock('./components/layout/topbar', () => ({
  __esModule: true,
  default: ({ onOpenLogoutModal, isSidebarCollapsed }: any) => (
    <div data-testid="topbar">
      <button onClick={onOpenLogoutModal}>OpenLogout</button>
      <span>{isSidebarCollapsed ? 'SidebarCollapsed' : 'SidebarExpanded'}</span>
    </div>
  ),
}));

// Mock react-router-dom's Outlet
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">OutletContent</div>,
  };
});

describe('AdminLayout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Sidebar, Topbar, and Outlet', () => {
    render(<AdminLayout />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('syncs sidebar collapse state with localStorage', async () => {
    localStorage.setItem('sidebarCollapsed', 'true');
    render(<AdminLayout />);
    // Should start collapsed
    expect(screen.getByText('Collapsed')).toBeInTheDocument();
    // Toggle collapse
    await act(async () => {
      screen.getByText('Toggle').click();
    });
    expect(localStorage.getItem('sidebarCollapsed')).toBe('false');
    expect(screen.getByText('Expanded')).toBeInTheDocument();
    await act(async () => {
      screen.getByText('Toggle').click();
    });
    expect(localStorage.getItem('sidebarCollapsed')).toBe('true');
    expect(screen.getByText('Collapsed')).toBeInTheDocument();
  });

  it('handles logout modal open/close', async () => {
    render(<AdminLayout />);
    // Modal should be closed initially
    expect(screen.getByText('LogoutModalClosed')).toBeInTheDocument();
    // Open modal
    await act(async () => {
      screen.getByText('OpenLogout').click();
    });
    expect(screen.getByText('LogoutModalOpen')).toBeInTheDocument();
    // Close modal
    await act(async () => {
      screen.getByText('CloseLogout').click();
    });
    expect(screen.getByText('LogoutModalClosed')).toBeInTheDocument();
  });
}); 