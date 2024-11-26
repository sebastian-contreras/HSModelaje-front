import { API_URL } from "../Fixes/API_URL.JS";
import axios from '../config/AxiosConfig.js';

export async function storeCajasApi(caja){
    const response = await axios.post(`${API_URL}/api/cajas`,caja);
    return response.data;
}