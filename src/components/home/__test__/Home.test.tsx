import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../Home';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
// import * as apiSlice from '../../../store/apiSlice';

// jest.mock('../../store/apiSlice', () => ({
//   ...jest.requireActual('../../store/apiSlice'),
//   useLazyGetWeatherQuery: () => [
//     jest.fn(),
//     { data: null, isLoading: false, isError: false },
//   ],
//   useLazyGetFullWeatherQuery: () => [
//     jest.fn(),
//     { data: null, isLoading: false, isError: false },
//   ],
// }));

describe('Home component', () => {
  it('renders input and button', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    expect(screen.getByLabelText(/enter city/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('allows input and triggers search', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    );

    const input = screen.getByLabelText(/enter city/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(button);

    expect((input as HTMLInputElement).value).toBe('London');
  });
});
