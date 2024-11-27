import { API_URL } from '../Fixes/API_URL.JS'
import axios from '../config/AxiosConfig.js'

export async function storePersonasApi (persona) {
  const response = await axios.post(`${API_URL}/api/personas`, persona)
  return response.data
}
export async function updatePersonasApi (persona, IdCaja) {
  delete persona.IdCaja
  const response = await axios.put(`${API_URL}/api/personas/` + IdCaja, persona)
  return response.data
}

export async function deletePersonasApi (IdCaja) {
    const response = await axios.delete(`${API_URL}/api/personas/` + IdCaja)
    return response.data
  }
  