import axios from "axios";
import {useAuth } from '../auth/AuthContext';

export const AxiosInterceptor = () => {
  const {logout} =  useAuth()
  const updateHeader = (request) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const headers = {
      "Content-Type": request.headers['Content-Type'] || "application/json",
      "Accept": request.headers['Accept'] || "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${tokens}`;
    request.headers = headers;

    return request;
  };

  axios.interceptors.request.use((request) => {
    return updateHeader(request);
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401 && !error.response.config.url.includes('/login')) {
        logout()
      }
      return Promise.reject(error);
    }
  );
};
