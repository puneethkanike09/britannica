import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header (BritannicaHeroSection)', () => {
  it('renders the main title and subtitle', () => {
    render(<Header />);
    expect(screen.getByText('Britannica Build')).toBeInTheDocument();
    expect(screen.getByText('Learn by Doing, Grow by Exploring')).toBeInTheDocument();
  });

  it('renders all feature titles', () => {
    render(<Header />);
    expect(screen.getByText('Research based')).toBeInTheDocument();
    expect(screen.getByText('learning')).toBeInTheDocument();
    expect(screen.getByText('Interdisciplinary')).toBeInTheDocument();
    expect(screen.getAllByText('connection').length).toBe(2);
    expect(screen.getByText('Focus on 21st')).toBeInTheDocument();
    expect(screen.getByText('century skills')).toBeInTheDocument();
    expect(screen.getByText('Alignment with')).toBeInTheDocument();
    expect(screen.getAllByText('SDGs').length).toBeGreaterThan(0);
    expect(screen.getByText('Real-world')).toBeInTheDocument();
  });
}); 