import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function dameModeloApi (id) {
  const response = await axios.get(`${API_URL}/api/modelos/show/` + id)
  console.log(response)
  return response.data
}

export async function listarModeloApi (pIncluyeBajas = true) {
  const response = await axios.get(`${API_URL}/api/modelos`, {
    params: { pIncluyeBajas: pIncluyeBajas }
  })
  console.log(response)
  return response.data
}

export async function storeModeloApi (item) {
  const response = await axios.post(`${API_URL}/api/modelos`, item)
  console.log(response)
  return response.data
}
export async function updateModeloApi (item, id) {
  delete item.id
  const response = await axios.put(`${API_URL}/api/modelos/` + id, item)
  return response.data
}

export async function deleteModeloApi (id) {
  const response = await axios.delete(`${API_URL}/api/modelos/` + id)
  console.log(`${API_URL}/api/modelos/` + id)
  console.log(response)
  return response.data
}

export async function darBajaModeloApi (id) {
  const response = await axios.post(`${API_URL}/api/modelos/darbaja/` + id)
  return response.data
}
export async function activarModeloApi (id) {
  const response = await axios.post(`${API_URL}/api/modelos/activar/` + id)
  return response.data
}
