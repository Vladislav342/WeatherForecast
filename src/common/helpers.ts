import { IWeather } from '../types/IWeather';

export let timeFormat = function (ms: number) {
  let months = [
    'Jan, Feb',
    'Maê',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  let a = new Date(ms * 1000);
  let hour = a.getHours();
  let date = a.getDate();
  let month = a.getMonth();

  return {
    time: hour + ':00',
    date,
    month: months[month - 1],
  };
};

export const getWeatherFromStorage = () => {
  const stored = localStorage.getItem('weatherHistory');
  return stored ? JSON.parse(stored) : [];
};

export const setWeatherToStorage = (data: IWeather[]) => {
  localStorage.setItem('weatherHistory', JSON.stringify(data));
};

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
