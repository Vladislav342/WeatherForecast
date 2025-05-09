import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.openweathermap.org/',
  }),
  tagTypes: ['Weather'],
  endpoints: builder => ({
    getWeather: builder.query({
      query: (city: string) =>
        `data/2.5/weather?q=${city}&appid=5796abbde9106b7da4febfae8c44c232`,
      providesTags: ['Weather'],
    }),
    getFullWeather: builder.query({
      query: ({ lat, lon }: { lat: number; lon: number }) =>
        `data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=5796abbde9106b7da4febfae8c44c232`,
      providesTags: ['Weather'],
    }),
  }),
});

export const {
  useGetWeatherQuery,
  useLazyGetWeatherQuery,
  useGetFullWeatherQuery,
  useLazyGetFullWeatherQuery,
} = apiSlice;
