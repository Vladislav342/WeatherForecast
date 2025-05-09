import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';

jest.mock('./components/home/Home', () => () => <div>Mocked Home Page</div>);
jest.mock('./components/weather/Weather', () => () => (
  <div>Mocked Weather Page</div>
));
jest.mock(
  './components/fullDetailsWeatherPage/FullDetailsWeatherPage',
  () => () => <div>Mocked Full Details Page</div>,
);

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  }),
) as jest.Mock;

describe('App component', () => {
  it('renders Home page and navigation buttons', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText(/Mocked Home Page/i)).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    // expect(
    //   screen.getByRole('button', { name: /weather/i }),
    // ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /weather/i })).toBeInTheDocument();
  });

  it('navigates to Weather page', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/weather']}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText(/Mocked Weather Page/i)).toBeInTheDocument();
  });

  it('opens drawer menu and shows links', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    );
    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);

    const buttons = await screen.findAllByText('Home');
    expect(buttons[0]).toBeInTheDocument();

    //expect(await screen.findAllByText('Home')).toBeInTheDocument();
    // expect(await screen.findByText('Weather')).toBeInTheDocument();

    expect(screen.getAllByText('Weather')[0]).toBeInTheDocument();
  });
});
