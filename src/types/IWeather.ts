export interface ITime {
  time: string;
  date: number;
  month: string;
}

interface ICountry {
  country: string;
  sunrise: number;
  sunset: number;
}

interface IForecast {
  description: string;
  id: number;
  main: string;
}

interface ICoord {
  lat: number;
  lon: number;
}

export interface IHourly {
  dt: ITime | number;
  pressure: number;
  temp: number;
  weather: IForecast[];
  wind_speed: number;
  feels_like: number;
  humidity: number;
}

export interface IWeather {
  city: string;
  date: ITime;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  weather: IForecast[];
  region: ICountry;
  coord: ICoord;
  hourly: IHourly[];
  timezone: string;
}

export interface IWeatherDay {
  day: IHourly[];
  timezone: string;
}
