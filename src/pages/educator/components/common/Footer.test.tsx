import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer (FlipCards)', () => {
  it('renders the main header', () => {
    render(<Footer />);
    expect(screen.getByText('Britannica Design Thinking')).toBeInTheDocument();
  });

  it('renders all card titles', () => {
    render(<Footer />);
    expect(screen.getByText('Driving Problems')).toBeInTheDocument();
    expect(screen.getByText('Focused Investigation')).toBeInTheDocument();
    expect(screen.getByText('Design Your Path')).toBeInTheDocument();
    expect(screen.getByText('Sketch to Structure')).toBeInTheDocument();
    expect(screen.getByText('Launch and Lead')).toBeInTheDocument();
    expect(screen.getByText('Creative Display')).toBeInTheDocument();
  });
}); 