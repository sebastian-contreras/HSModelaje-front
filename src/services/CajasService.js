import { API_URL } from '../Fixes/API_URL.JS'
import axios from '../config/AxiosConfig.js'

export async function storeCajasApi (caja) {
  const response = await axios.post(`${API_URL}/api/cajas`, caja)
  return response.data
}
export async function updateCajasApi (caja, IdCaja) {
  delete caja.IdCaja
  const response = await axios.put(`${API_URL}/api/cajas/` + IdCaja, caja)
  return response.data
}

export async function deleteCajaApi (IdCaja) {
    const response = await axios.delete(`${API_URL}/api/cajas/` + IdCaja)
    return response.data
  }
  