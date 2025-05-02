import axios from 'axios';
import { getJwtToken } from '@modules/utils/localStorageUtil';
export const hsApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

hsApi.interceptors.request.use(
  async (config) => {
    const token = await getJwtToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
