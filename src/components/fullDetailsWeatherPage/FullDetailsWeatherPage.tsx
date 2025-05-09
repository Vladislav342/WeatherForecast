import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { IWeather, IHourly } from '../../types/IWeather';
import * as styles from './index.module.scss';
import { WeatherDay } from './WeatherDay';
import { getWeatherFromStorage } from '../../common/helpers';

const FullDetailsWeatherPage = () => {
  const { city } = useParams<{ city: string }>();
  const [weatherHistory, setWeatherHistory] = useState<IWeather | null>(null);
  const [firstDay, setFirstDay] = useState<IHourly[]>([]);
  const [secondDay, setSecondDay] = useState<IHourly[]>([]);
  const [thirdDay, setThirdDay] = useState<IHourly[]>([]);

  let weatherDays = [[...firstDay], [...secondDay], [...thirdDay]];

  useEffect(() => {
    let history = getWeatherFromStorage();
    let neededCity: IWeather = history.find(
      (item: IWeather) =>
        city && item.city.toLowerCase() === city.toLowerCase(),
    );

    let days: number[] = [];
    neededCity.hourly.forEach(item => {
      if (typeof item.dt !== 'number' && !days.includes(item.dt.date)) {
        days.push(item.dt.date);
      }
    });

    let filteredData = (index: number) => {
      return neededCity.hourly.filter(
        (item: IHourly) =>
          typeof item.dt !== 'number' && item.dt.date === days[index],
      );
    };

    setFirstDay(filteredData(0));
    setSecondDay(filteredData(1));
    setThirdDay(filteredData(2));

    if (neededCity) {
      setWeatherHistory(neededCity);
    }
  }, []);

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={4} className={styles.header}>
        <Typography variant="h2" className={styles.headerCityName}>
          {city}
          <sup className={styles.headerCountryCode}>
            {weatherHistory?.region.country}
          </sup>
        </Typography>
      </Box>

      <hr />

      {weatherHistory &&
        weatherDays.map((day, index) => (
          <React.Fragment key={index}>
            <WeatherDay day={day} timezone={weatherHistory.timezone} />
            <hr />
          </React.Fragment>
        ))}
    </Container>
  );
};

export default FullDetailsWeatherPage;
