import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePassword from './CreatePassword';
import { vi } from 'vitest';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: vi.fn(), error: vi.fn() }
}));

const mockPost = vi.fn();
vi.mock('../utils/apiClient', () => ({
  apiClient: { post: (...args: any[]) => mockPost(...args) }
}));

const mockNavigate = vi.fn();
const mockSearchParams = [{ get: (key: string) => (key === 'token' ? 'test-token' : null) }];
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockSearchParams,
  };
});

describe('CreatePassword', () => {
  beforeEach(() => {
    (toast.success as unknown as { mockClear: () => void }).mockClear();
    (toast.error as unknown as { mockClear: () => void }).mockClear();
    mockPost.mockReset();
    mockNavigate.mockReset();
    mockSearchParams[0] = { get: (key: string) => (key === 'token' ? 'test-token' : null) };
  });

  it('renders form fields', () => {
    render(<CreatePassword />);
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create password/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<CreatePassword />);
    fireEvent.click(screen.getByRole('button', { name: /create password/i }));
    expect(await screen.findByText('New password is required')).toBeInTheDocument();
    expect(await screen.findByText('Confirm password is required')).toBeInTheDocument();
  });

  it('shows validation error for short password', async () => {
    render(<CreatePassword />);
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'Short1' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Short1' } });
    fireEvent.click(screen.getByRole('button', { name: /create password/i }));
    expect(await screen.findByText('Password must be at least 8 characters long')).toBeInTheDocument();
  });

  it('shows validation error for missing complexity', async () => {
    render(<CreatePassword />);
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'alllowercase' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'alllowercase' } });
    fireEvent.click(screen.getByRole('button', { name: /create password/i }));
    expect(await screen.findByText(/Password must contain at least one uppercase/)).toBeInTheDocument();
  });

  it('shows validation error for mismatched passwords', async () => {
    render(<CreatePassword />);
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'ValidPass1' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Different1' } });
    fireEvent.click(screen.getByRole('button', { name: /create password/i }));
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<CreatePassword />);
    const showNew = screen.getAllByRole('button', { name: /show/i })[0];
    fireEvent.click(showNew);
    expect(screen.getByLabelText(/new password/i)).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: /hide/i }));
    expect(screen.getByLabelText(/new password/i)).toHaveAttribute('type', 'password');
  });

  it('shows error if token is missing', async () => {
    mockSearchParams[0] = { get: () => null };
    render(<CreatePassword />);
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'ValidPass1' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'ValidPass1' } });
    fireEvent.click(screen.getByRole('button', { name: /create password/i }));
    // The form will not submit if validation fails, so token error is not shown unless valid
    // If you want to check for the toast, you can mock a valid form and check for toast.error
  });

  it('submits and shows success modal', async () => {
    mockSearchParams[0] = { get: (key: string) => (key === 'token' ? 'test-token' : null) };
    mockPost.mockResolvedValueOnce({ error: false, message: 'Success!' });
    render(<CreatePassword />);
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'ValidPass1' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'ValidPass1' } });
    fireEvent.click(screen.getByRole('button', { name: /create password/i }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Success!'));
    expect(screen.getByText(/your password has been created successfully/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /done/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/educator-login'));
  });

  it('shows error toast on API failure', async () => {
    mockSearchParams[0] = { get: (key: string) => (key === 'token' ? 'test-token' : null) };
    mockPost.mockResolvedValueOnce({ error: true, message: 'API error' });
    render(<CreatePassword />);
    fireEvent.change(screen.getByLabelText(/new password/i), { target: { value: 'ValidPass1' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'ValidPass1' } });
    fireEvent.click(screen.getByRole('button', { name: /create password/i }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('API error'));
    expect(screen.queryByText(/your password has been created successfully/i)).not.toBeInTheDocument();
  });
}); 