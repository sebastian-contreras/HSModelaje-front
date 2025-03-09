import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function damePatrocinadorApi (id) {
  const response = await axios.get(`${API_URL}/api/patrocinadores/show/` + id)
  console.log(response)
  return response.data
}

export async function listarPatrocinadorApi (pIdEvento) {
  const response = await axios.get(`${API_URL}/api/patrocinadores/`+pIdEvento)
  console.log(response)
  return response.data
}

export async function storePatrocinadorApi (item) {
  const response = await axios.post(`${API_URL}/api/patrocinadores`, item)
  console.log(response)
  return response.data
}
export async function updatePatrocinadorApi (item, id) {
  const response = await axios.put(`${API_URL}/api/patrocinadores/` + id, item)
  return response.data
}

export async function deletePatrocinadorApi (id) {
  const response = await axios.delete(`${API_URL}/api/patrocinadores/` + id)
  console.log(`${API_URL}/api/patrocinadores/` + id)
  console.log(response)
  return response.data
}

