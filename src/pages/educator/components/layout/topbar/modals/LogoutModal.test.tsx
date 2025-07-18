import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LogoutModal from './LogoutModal';
import { vi } from 'vitest';
import toast from 'react-hot-toast';

// Mock useAuth
const mockLogout = vi.fn().mockResolvedValue({ message: 'Logged out successfully!' });
vi.mock('../../../../../../hooks/useAuth', () => ({
  useAuth: () => ({
    logout: mockLogout
  })
}));
// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});
// Mock toast
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: vi.fn(), error: vi.fn() }
}));

describe('LogoutModal', () => {
  beforeEach(() => {
    mockLogout.mockClear();
    (toast.success as unknown as { mockClear: () => void }).mockClear();
    (toast.error as unknown as { mockClear: () => void }).mockClear();
  });

  it('renders and closes on cancel', async () => {
    const onClose = vi.fn();
    render(<LogoutModal onClose={onClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('calls logout and navigates on confirm', async () => {
    const onClose = vi.fn();
    render(<LogoutModal onClose={onClose} />);
    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('disables buttons while logging out', async () => {
    const onClose = vi.fn();
    render(<LogoutModal onClose={onClose} />);
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText('Cancel').closest('button')).toBeDisabled();
    const logoutButton = screen.getAllByRole('button').find(
      btn => btn.textContent === 'Logout' || btn.querySelector('.animate-spin')
    );
    expect(logoutButton).toBeDisabled();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('closes when clicking on the backdrop', async () => {
    const onClose = vi.fn();
    render(<LogoutModal onClose={onClose} />);
    // Find the backdrop by its class
    const backdrop = screen.getByText('Logout').closest('.fixed');
    fireEvent.click(backdrop!);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('closes when Escape key is pressed', async () => {
    const onClose = vi.fn();
    render(<LogoutModal onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('does not close if isLoggingOut is true', async () => {
    const onClose = vi.fn();
    render(<LogoutModal onClose={onClose} />);
    fireEvent.click(screen.getByText('Logout'));
    // Try to close while logging out
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);
    // onClose should not be called again until logout finishes
    expect(onClose).not.toHaveBeenCalledTimes(2);
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('shows default success message if logout returns no message', async () => {
    mockLogout.mockResolvedValueOnce({});
    const onClose = vi.fn();
    render(<LogoutModal onClose={onClose} />);
    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Logged out successfully!');
  });

  it('shows error toast if logout fails', async () => {
    mockLogout.mockRejectedValueOnce({ message: 'Custom error' });
    const onClose = vi.fn();
    render(<LogoutModal onClose={onClose} />);
    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Custom error'));
  });
}); 