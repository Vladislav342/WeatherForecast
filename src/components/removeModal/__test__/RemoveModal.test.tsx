import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RemoveModal } from '../RemoveModal';

jest.mock('@mui/material/ButtonBase/TouchRipple', () => () => null);

describe('RemoveModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    city: 'Kyiv',
  };

  it('renders modal with correct content', () => {
    render(<RemoveModal {...defaultProps} />);
    expect(screen.getByText(/Removing/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Are you sure you want to remove/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    render(<RemoveModal {...defaultProps} />);
    const cancelBtn = screen.getByText(/Cancel/i);
    await userEvent.click(cancelBtn); // замість fireEvent
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onConfirm when Delete button is clicked', async () => {
    render(<RemoveModal {...defaultProps} />);
    const deleteButton = screen.getByText(/Delete/i);
    await userEvent.click(deleteButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});