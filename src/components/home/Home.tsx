import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CircularProgress,
  Typography,
  Container,
  Box,
  Button,
  TextField,
} from '@mui/material';
import * as styles from './index.module.scss';
import {
  useLazyGetWeatherQuery,
  useLazyGetFullWeatherQuery,
} from '../../store/apiSlice';
import {
  timeFormat,
  getWeatherFromStorage,
  setWeatherToStorage,
} from '../../common/helpers';
import { IWeather, IHourly } from '../../types/IWeather';
import { CardWeather } from '../card/Card';
import { RemoveModal } from '../removeModal/RemoveModal';
import { labels } from './constants';

const Home = () => {
  // localStorage.removeItem('weatherHistory');

  const [isRemoveModalOpen, setRemoveModalOpen] = useState<boolean>(false);

  const [city, setCity] = useState('');
  const [nameOfRemovingCity, setNameOfRemovingCity] = useState<string>('');
  const [weatherHistory, setWeatherHistory] = useState<IWeather[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const [getWeather, { data, isLoading, isError }] = useLazyGetWeatherQuery();
  const [
    getFullWeather,
    { data: fullWeather, isLoading: isFullLoading, isError: isFullError },
  ] = useLazyGetFullWeatherQuery();

  const [hasError, setHasError] = useState(false);
  const [inputHasError, setInputHasError] = useState(false);

  const handleSearch = () => {
    const cleanCity = city.trim();
    const isValid = /^[A-Za-z\s]{1,30}$/.test(cleanCity);

    if (!isValid) {
      setInputHasError(true);
      return;
    }

    setInputHasError(false);
    getWeather(cleanCity);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    if (hasError) setHasError(false);
    if (inputHasError) setInputHasError(false);
  };

  const handleRefresh = useCallback((refreshCity: string) => {
    getWeather(refreshCity);
  }, []);

  const handleRemoveModal = useCallback((removeCity: string) => {
    setNameOfRemovingCity(removeCity);
    setRemoveModalOpen(true);
  }, []);

  const handleRemove = useCallback((removeCity: string) => {
    const history = getWeatherFromStorage();
    const exists: number = history.findIndex(
      (item: IWeather) => item.city.toLowerCase() === removeCity.toLowerCase(),
    );
    history.splice(exists, 1);
    setWeatherToStorage(history);
    setWeatherHistory(history);
    setRemoveModalOpen(false);
    setNameOfRemovingCity('');
  }, []);

  const handleAnotherDay = useCallback(
    (action: string, day: number, cardCity: string) => {
      let nextDay = action === 'prev' ? day - 1 : day + 1;
      const history = getWeatherFromStorage();
      let indexCity = 0;
      const neededCity = history.find((item: IWeather, index: number) => {
        indexCity = index;
        return item.city.toLowerCase() === cardCity.toLowerCase();
      });

      let neededHours = neededCity.hourly.filter(
        (item: IHourly) =>
          typeof item.dt !== 'number' && item.dt.date === nextDay,
      );

      if (neededHours.length === 0) {
        nextDay =
          action === 'prev' && typeof neededCity.hourly.dt !== 'number'
            ? neededCity.hourly[neededCity.hourly.length - 1].dt.date
            : neededCity.hourly[0].dt.date;

        neededHours = neededCity.hourly.filter(
          (item: IHourly) =>
            typeof item.dt !== 'number' && item.dt.date === nextDay,
        );
      }

      let newWeather = {
        ...neededCity,
        date: {
          ...neededCity.date,
          date: nextDay,
        },
      };

      history.splice(indexCity, 1, newWeather);
      setWeatherToStorage(history);
      setWeatherHistory(history);
    },
    [],
  );

  useEffect(() => {
    const stored = getWeatherFromStorage();
    setWeatherHistory(stored);

    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (isError || isFullError) {
      setHasError(true);
    }
  }, [isError, isFullError]);

  useEffect(() => {
    if (data) {
      getFullWeather({ lat: data.coord.lat, lon: data.coord.lon });
    }
  }, [data]);

  useEffect(() => {
    if (fullWeather) {
      let newCity: null | IWeather = null;
      const history = getWeatherFromStorage();
      const exists: number = history.findIndex(
        (item: IWeather) => item.city.toLowerCase() === data.name.toLowerCase(),
      );

      let curDate = timeFormat(data.dt);
      let days: IHourly[] = [];
      fullWeather.hourly.forEach((item: IHourly) => {
        let hour: IHourly = {
          dt: typeof item.dt === 'number' ? timeFormat(item.dt) : item.dt,
          pressure: item.pressure,
          temp: Math.round(item.temp),
          weather: item.weather,
          wind_speed: item.wind_speed,
          feels_like: Math.round(item.feels_like),
          humidity: item.humidity,
        };
        days.push(hour);
      });

      newCity = {
        coord: data.coord,
        city: data.name,
        date: curDate,
        temp: fullWeather.current.temp.toFixed(0),
        feels_like: data.main.feels_like,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        wind_speed: data.main.wind_speed,
        weather: data.weather,
        region: data.sys,
        hourly: days,
        timezone: fullWeather.timezone,
      };

      if (exists !== -1) {
        history.splice(exists, 1, newCity);
      } else {
        history.push(newCity);
      }

      setWeatherToStorage(history);
      setWeatherHistory(history);
      setCity('');
    }
  }, [fullWeather]);

  return (
    <Container>
      <Container maxWidth="sm" className={styles.centerContent}>
        <Box
          component="form"
          className={styles.centerContentForm}
          noValidate
          autoComplete="off"
        >
          <TextField
            inputRef={inputRef}
            label={labels.inputLabel}
            variant="outlined"
            fullWidth
            className={styles.centerContentInput}
            value={city}
            onChange={handleInput}
            error={inputHasError}
            helperText={inputHasError ? labels.inputErrorMessage : ''}
          />
          <Button
            variant="contained"
            color="primary"
            className={styles.centerContentSearch}
            disabled={isLoading}
            onClick={handleSearch}
          >
            {isLoading || isFullLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              labels.btnSearch
            )}
          </Button>
        </Box>
      </Container>

      {hasError && (
        <Box mt={2} textAlign="center">
          <Typography color="error">{labels.errMessage(city)}</Typography>
        </Box>
      )}

      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {weatherHistory.length > 0
          ? weatherHistory.map(weather => (
              <CardWeather
                key={weather.city}
                forecast={weather}
                onDelete={removeCity => handleRemoveModal(removeCity)}
                onRefresh={refreshCity => handleRefresh(refreshCity)}
                onPrevDay={(action, day, cardCity) =>
                  handleAnotherDay(action, day, cardCity)
                }
                onNextDay={(action, day, cardCity) =>
                  handleAnotherDay(action, day, cardCity)
                }
              />
            ))
          : null}
      </Box>

      <RemoveModal
        open={isRemoveModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        onConfirm={() => handleRemove(nameOfRemovingCity)}
        city={nameOfRemovingCity}
      />
    </Container>
  );
};

export default Home;
