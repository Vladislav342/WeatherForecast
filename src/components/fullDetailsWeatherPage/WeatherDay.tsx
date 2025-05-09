import React from 'react';
import { IWeatherDay } from '../../types/IWeather';
import { Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import * as styles from './index.module.scss';
import { options } from '../../common/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const WeatherDay = (weatherDay: IWeatherDay) => {
  let { day, timezone } = weatherDay;

  const data = {
    labels: day.map(item => typeof item.dt !== 'number' && item.dt.time),
    datasets: [
      {
        label: '',
        data: day.map(item => typeof item.dt !== 'number' && item.temp),
        borderWidth: 1,
        borderColor: '#FF6384',
        backgroundColor: '#FFB1C1',
      },
    ],
  };

  return (
    <Box mb={4}>
      <Box textAlign="center" mt={4} className={styles.header}>
        {day[0] && typeof day[0].dt !== 'number' && (
          <>
            <Typography variant="h4" className={styles.headerCityName}>
              {day[0].dt.date}
            </Typography>
            <Typography variant="h4">{day[0].dt.month}</Typography>
          </>
        )}
      </Box>

      <Box>
        <Box mt={6} gap={2} className={styles.content}>
          <Box mb={1} className={styles.contentTemp}>
            <Typography variant="h3">
              {day[0]?.temp}
              <sup>o</sup>
            </Typography>
            <Typography variant="h6">
              {day[0]?.weather[0].description}
            </Typography>
          </Box>
          <Box>
            {day[0]?.weather[0]?.main ? (
              <img
                src={require(
                  `../../images/${day[0].weather[0].main.toLowerCase()}.png`,
                )}
                alt="weather icon"
                width={100}
                height={100}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No image available
              </Typography>
            )}
          </Box>
          <Box className={styles.contentTemp}>
            <Typography variant="h6">{'Timezone: ' + timezone}</Typography>
            <Typography variant="h6">
              {'Feels like: ' + day[0]?.feels_like}
              <sup>o</sup>
            </Typography>
            <Typography variant="h6">
              {'Pressure: ' + day[0]?.pressure}
            </Typography>
            <Typography variant="h6">
              {'Humidity: ' + day[0]?.humidity}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className={styles.chart} mt={4}>
        <Line options={options} data={data} />
      </Box>
    </Box>
  );
};
