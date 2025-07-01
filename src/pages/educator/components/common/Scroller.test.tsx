import { render, screen } from '@testing-library/react';
import ScrollingBanner from './Scroller';

describe('ScrollingBanner', () => {
  it('renders the scrolling quote three times', () => {
    render(<ScrollingBanner />);
    const quote = "The aim of education should be to teach us rather how to think, than what to think. – James Beattie";
    // There should be three instances of the quote
    expect(screen.getAllByText(quote).length).toBe(3);
  });

  it('renders the static section', () => {
    render(<ScrollingBanner />);
    expect(screen.getByText('Real Problems. Real Teams. Real Impact')).toBeInTheDocument();
  });
}); 