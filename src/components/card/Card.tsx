import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  CardContent,
  Box,
  IconButton,
  Tooltip as TooltipMaterial,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { IWeather } from '../../types/IWeather';
import styles from './index.module.scss';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

interface CardWeatherProps {
  forecast: IWeather;
  onDelete: (city: string) => void;
  onRefresh: (city: string) => void;
  onPrevDay: (action: string, day: number, cardCity: string) => void;
  onNextDay: (action: string, day: number, cardCity: string) => void;
}

export const CardWeather: React.FC<CardWeatherProps> = ({
  forecast,
  onDelete,
  onRefresh,
  onPrevDay,
  onNextDay,
}) => {
  const { city, date, region, hourly } = forecast;
  const navigate = useNavigate();

  let hoursForecast = hourly.filter(
    item => typeof item.dt !== 'number' && item.dt.date === date.date,
  );
  let curDay =
    typeof hoursForecast[0].dt !== 'number' && hoursForecast[0].dt.date;
  let curMonth =
    typeof hoursForecast[0].dt !== 'number' && hoursForecast[0].dt.month;

  let curWeather = hoursForecast[0].weather[0];

  const data2 = {
    labels: hoursForecast.map(
      item => typeof item.dt !== 'number' && item.dt.time,
    ),
    datasets: [
      {
        label: '',
        data: hoursForecast.map(
          item => typeof item.dt !== 'number' && item.temp,
        ),
        borderWidth: 1,
        borderColor: '#FF6384',
        backgroundColor: '#FFB1C1',
      },
    ],
  };

  return (
    <Card
      onClick={() => navigate(`/details/${city}`)}
      sx={{
        width: 400,
        margin: 'auto',
        mt: 4,
        mb: 2,
        boxShadow: 3,
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box className={styles.card}>
          <Box>
            <Typography variant="h5" className={styles.cardCity}>
              {city}
              <sup className={styles.cardSub}>{region.country}</sup>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={e => {
                e.stopPropagation();
                onPrevDay('prev', date.date, city);
              }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="h6">{curDay + ' ' + curMonth}</Typography>
            <IconButton
              onClick={e => {
                e.stopPropagation();
                onNextDay('next', date.date, city);
              }}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
          <Box className={styles.cardIcons}>
            <TooltipMaterial title="Refresh">
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                  onRefresh(city);
                }}
                size="small"
              >
                <CachedIcon />
              </IconButton>
            </TooltipMaterial>
            <TooltipMaterial title="Remove">
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                  onDelete(city);
                }}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </TooltipMaterial>
          </Box>
        </Box>

        <Box mt={1} gap={2} className={styles.card}>
          <Box mb={1} className={styles.forecast}>
            <Typography variant="h3" className={styles.forecastNumber}>
              {hoursForecast[0].temp}
              <sup>o</sup>
            </Typography>
            <Typography variant="h6">{curWeather.description}</Typography>
          </Box>

          <Box>
            <img
              src={require(`../../images/${curWeather.main.toLowerCase()}.png`)}
              alt="weather icon"
              width={100}
              height={100}
            />
          </Box>
        </Box>

        <Line options={options} data={data2} />
      </CardContent>
    </Card>
  );
};
