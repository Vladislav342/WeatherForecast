import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Weather from '../Weather';

describe('Weather Component', () => {
  it('renders the page title and description correctly', () => {
    render(<Weather />);

    expect(screen.getByText(/Weather Page/i)).toBeInTheDocument();
    expect(screen.getByText(/this page was created simply as an example of how to place the page panel on the site./i)).toBeInTheDocument();
  });
});