import axios from '../config/AxiosConfig.js';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(usuario, clave, twofa='') {
  try {
    const body = {
      "email": usuario,
      "password": clave,
      // "2fa_code": twofa
    };
    const response = await axios.post(`${API_URL}/api/login`, body);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
}