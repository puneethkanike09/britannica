import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders the loader spinner', () => {
    render(<Loader />);
    const loader = screen.getByRole('status', { name: /loading/i });
    expect(loader).toBeInTheDocument();
    expect(loader.querySelector('.loader')).toBeInTheDocument();
  });

  it('renders the message if provided', () => {
    render(<Loader message="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('does not render a message if not provided', () => {
    render(<Loader />);
    const message = screen.queryByText(/loading/i);
    // Only the aria-label should match, not a <p> message
    expect(message?.tagName).not.toBe('P');
  });
}); 