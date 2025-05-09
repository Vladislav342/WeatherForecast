import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardWeather } from '../Card';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../../images/clear.png', () => 'clear.png');
jest.mock('../../images/clouds.png', () => 'clouds.png');
jest.mock('../../images/clear.png', () => 'rain.png');
jest.mock('../../images/clouds.png', () => 'sunny.png');

const mockOnDelete = jest.fn();
const mockOnRefresh = jest.fn();
const mockOnPrevDay = jest.fn();
const mockOnNextDay = jest.fn();

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: () => ({
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: [] }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    }),
  });

const mockForecast = {
  city: 'Kyiv',
  region: { country: 'Ukraine', sunrise: 456374347, sunset: 45454545 },
  date: { time: '342323323', date: 6, month: 'May' },
  hourly: [
    {
      dt: { time: '342323323', date: 6, month: 'May' },
      temp: 20,
      weather: [
        { main: 'Clear', description: 'clear sky', id: 10 }
      ],
      wind_speed: 1000,
      feels_like: 14,
      humidity: 345,
      pressure: 32
    }
  ],
  temp: 45,
  feels_like: 34,
  pressure: 340,
  humidity: 342,
  wind_speed: 233,
  coord: {lat: 45343434, lon: 4545454545},
  timezone: 'Europe',
  weather: [
    { main: 'Clear', description: 'clear sky', id: 10 }
  ],
};

const renderCard = () =>
  render(
    <BrowserRouter>
      <CardWeather
        forecast={mockForecast}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        onPrevDay={mockOnPrevDay}
        onNextDay={mockOnNextDay}
      />
    </BrowserRouter>
  );

describe('CardWeather component', () => {
  it('renders city and country', () => {
    renderCard();
    expect(screen.getByText(/Kyiv/i)).toBeInTheDocument();
    expect(screen.getByText(/Ukraine/i)).toBeInTheDocument();
  });

  it('renders temperature and description', () => {
    renderCard();
    expect(screen.getByText(/20/)).toBeInTheDocument();
    expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
  });

  it('calls onDelete when delete icon is clicked', async () => {
    renderCard();
    const btn = screen.getByRole('button', { name: /remove/i });
    await userEvent.click(btn);
    expect(mockOnDelete).toHaveBeenCalledWith('Kyiv');
  });

  it('calls onRefresh when refresh icon is clicked', async () => {
    renderCard();
    const btn = screen.getByRole('button', { name: /refresh/i });
    await userEvent.click(btn);
    expect(mockOnRefresh).toHaveBeenCalledWith('Kyiv');
  });

  it('calls onPrevDay and onNextDay correctly', async () => {
    renderCard();
    await userEvent.click(screen.getByTestId('arrow-left'));
    await userEvent.click(screen.getByTestId('arrow-right'));
  });
});