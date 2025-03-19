import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function dameEntradaApi (id) {
  const response = await axios.get(`${API_URL}/api/entradas/show/` + id)
  console.log(response)
  return response.data
}

export async function listarEntradaApi (pIdEvento) {
  const response = await axios.get(`${API_URL}/api/entradas/`+pIdEvento)
  console.log(response)
  return response.data
}

export async function storeEntradaApi (item) {
  const response = await axios.post(`${API_URL}/api/entradas`, item)
  console.log(response)
  return response.data
}
export async function updateEntradaApi (item, id) {
  const response = await axios.put(`${API_URL}/api/entradas/` + id, item)
  return response.data
}

export async function deleteEntradaApi (id) {
  const response = await axios.delete(`${API_URL}/api/entradas/` + id)
  console.log(`${API_URL}/api/entradas/` + id)
  console.log(response)
  return response.data
}



export async function abonarEntradaApi (id) {
  const response = await axios.post(`${API_URL}/api/entradas/abonar/` + id)
  return response.data
}

export async function usarEntradaApi (id) {
  const response = await axios.post(`${API_URL}/api/entradas/usar/` + id)
  return response.data
}

export async function rechazarEntradaApi (id) {
  const response = await axios.post(`${API_URL}/api/entradas/rechazar/` + id)
  return response.data
}
