import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FullDetailsWeatherPage from '../FullDetailsWeatherPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IWeather } from '../../../types/IWeather';

jest.mock('../../../common/helpers', () => ({
  getWeatherFromStorage: jest.fn(() => [
    {
      city: 'London',
      region: { country: 'GB' },
      timezone: 0,
      hourly: [
        { dt: { date: 1, hour: '00:00' }, temp: 10, pressure: 1000, weather: [], wind_speed: 5, feels_like: 8, humidity: 80 },
        { dt: { date: 2, hour: '00:00' }, temp: 12, pressure: 1010, weather: [], wind_speed: 6, feels_like: 9, humidity: 70 },
        { dt: { date: 3, hour: '00:00' }, temp: 14, pressure: 1020, weather: [], wind_speed: 7, feels_like: 10, humidity: 60 },
      ],
    },
  ]),
}));

jest.mock('../WeatherDay', () => ({
  WeatherDay: ({ day, timezone }: { day: any; timezone: number }) => (
    <div data-testid="weather-day">Mocked WeatherDay ({day.length})</div>
  ),
}));

describe('FullDetailsWeatherPage', () => {
  it('renders city and 3 WeatherDay components', () => {
    render(
      <MemoryRouter initialEntries={['/details/London']}>
        <Routes>
          <Route path="/details/:city" element={<FullDetailsWeatherPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/London/i)).toBeInTheDocument();
    expect(screen.getByText(/GB/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('weather-day')).toHaveLength(3);
  });
});