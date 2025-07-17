import { render, screen, fireEvent } from '@testing-library/react';
import DocumentCard from './PdfCards';

import { vi } from 'vitest';

describe('DocumentCard', () => {
  const defaultProps = {
    title: 'Test PDF',
    onDownload: vi.fn(),
    viewLoading: false,
    downloadLoading: false,
    file: 'dummy.pdf',
  };

  it('renders the title and buttons', () => {
    render(<DocumentCard {...defaultProps} />);
    expect(screen.getByText('Test PDF')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('calls onDownload when Download button is clicked', () => {
    render(<DocumentCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Download'));
    expect(defaultProps.onDownload).toHaveBeenCalled();
  });

  it('disables View button and shows loader when viewLoading is true', () => {
    render(<DocumentCard {...defaultProps} viewLoading={true} />);
    const viewButton = screen.getByText('View').closest('button');
    expect(viewButton).toBeDisabled();
    expect(viewButton?.querySelector('.loader')).toBeInTheDocument();
  });

  it('disables Download button and shows loader when downloadLoading is true', () => {
    render(<DocumentCard {...defaultProps} downloadLoading={true} />);
    const downloadButton = screen.getByText('Download').closest('button');
    expect(downloadButton).toBeDisabled();
    expect(downloadButton?.querySelector('.loader')).toBeInTheDocument();
  });
}); 