import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../Home';
import { Provider } from 'react-redux';
import { setupStore } from '../__mocks__/mockStore';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;

jest.mock('../../../store/apiSlice', () => ({
  ...jest.requireActual('../../../store/apiSlice'),
  useLazyGetWeatherQuery: () => [jest.fn(), { data: null, isLoading: false, isError: false }],
  useLazyGetFullWeatherQuery: () => [jest.fn(), { data: null, isLoading: false, isError: false }],
}));

const store = setupStore();

describe('Home component', () => {
  it('renders input and button', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    expect(screen.getByLabelText(/enter your city/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('allows input and triggers search', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    const input = screen.getByLabelText(/enter your city/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(button);

    expect((input as HTMLInputElement).value).toBe('London');
  });

  it('shows error message for invalid city name', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    const input = screen.getByLabelText(/enter your city/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '123!!!' } });
    fireEvent.click(button);

    expect(screen.getByText(/only letters allowed/i)).toBeInTheDocument();
  });
});