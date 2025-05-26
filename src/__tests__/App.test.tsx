import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders hello message', () => {
    render(<App />);
    const helloElement = screen.getByText(/Hello Britannica/i);
    expect(helloElement).toBeInTheDocument();
  });
});