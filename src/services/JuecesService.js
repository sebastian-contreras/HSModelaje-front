import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function dameJuezApi (id) {
  const response = await axios.get(`${API_URL}/api/jueces/show/` + id)
  console.log(response)
  return response.data
}

export async function listarJuezApi (pIdEvento,pIncluyeBajas = true) {
  const response = await axios.get(`${API_URL}/api/jueces`, {
    params: { pIncluyeBajas: pIncluyeBajas, pIdEvento:pIdEvento }
  })
  console.log(response)
  return response.data
}

export async function storeJuezApi (item) {
  const response = await axios.post(`${API_URL}/api/jueces`, item)
  console.log(response)
  return response.data
}
export async function updateJuezApi (item, id) {
  delete item.id
  const response = await axios.put(`${API_URL}/api/jueces/` + id, item)
  return response.data
}

export async function deleteJuezApi (id) {
  const response = await axios.delete(`${API_URL}/api/jueces/` + id)
  console.log(`${API_URL}/api/jueces/` + id)
  console.log(response)
  return response.data
}

export async function darBajaJuezApi (id) {
  const response = await axios.post(`${API_URL}/api/jueces/darbaja/` + id)
  return response.data
}
export async function activarJuezApi (id) {
  const response = await axios.post(`${API_URL}/api/jueces/activar/` + id)
  return response.data
}
