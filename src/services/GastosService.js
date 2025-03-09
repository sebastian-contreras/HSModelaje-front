import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function dameGastoApi (id) {
  const response = await axios.get(`${API_URL}/api/gastos/show/` + id)
  console.log(response)
  return response.data
}

export async function listarGastoApi (pIdEvento) {
  const response = await axios.get(`${API_URL}/api/gastos/`+pIdEvento)
  console.log(response)
  return response.data
}

export async function storeGastoApi (item) {
  const response = await axios.post(`${API_URL}/api/gastos`, item)
  console.log(response)
  return response.data
}
export async function updateGastoApi (item, id) {
  const response = await axios.put(`${API_URL}/api/gastos/` + id, item)
  return response.data
}

export async function deleteGastoApi (id) {
  const response = await axios.delete(`${API_URL}/api/gastos/` + id)
  console.log(`${API_URL}/api/gastos/` + id)
  console.log(response)
  return response.data
}

