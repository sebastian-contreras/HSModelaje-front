import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function listarEventoApi (pIncluyeBajas = true) {
  const response = await axios.get(`${API_URL}/api/eventos`, {
    params: { pIncluyeBajas: pIncluyeBajas }
  }
)
  console.log(response)
  return response.data
}


export async function storeEventoApi (item) {
  const response = await axios.post(`${API_URL}/api/eventos`, item)
  console.log(response)
  return response.data
}
export async function updateEventoApi (item, id) {
  delete item.id
  const response = await axios.put(`${API_URL}/api/eventos/` + id, item)
  return response.data
}

export async function deleteEventoApi (id) {
  const response = await axios.delete(`${API_URL}/api/eventos/` + id)
  console.log(`${API_URL}/api/eventos/` + id)
  console.log(response)
  return response.data
}


export async function darBajaEventoApi (id) {
  const response = await axios.post(`${API_URL}/api/eventos/darbaja/` + id)
  return response.data
}
export async function activarEventoApi (id) {
  const response = await axios.post(`${API_URL}/api/eventos/activar/` + id)
  return response.data
}
export async function finalizarEventoApi (data) {
    const response = await axios.post(`${API_URL}/api/eventos/finalizar/` + data.IdEvento,data)
    return response.data
  }