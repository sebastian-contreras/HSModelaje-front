import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function dameZonaApi (id) {
  const response = await axios.get(`${API_URL}/api/zonas/show/` + id)
  console.log(response)
  return response.data
}

export async function listarZonaApi (pIdEvento,pIncluyeBajas = true,cantidad = 10) {
  const response = await axios.get(`${API_URL}/api/zonas/busqueda`, {
    params: { pIncluyeBajas: pIncluyeBajas, pIdEvento:pIdEvento, cantidad: cantidad }
  })
  console.log(response)
  return response.data
}

export async function storeZonaApi (item) {
  const response = await axios.post(`${API_URL}/api/zonas`, item)
  console.log(response)
  return response.data
}
export async function updateZonaApi (item, id) {
  delete item.id
  const response = await axios.put(`${API_URL}/api/zonas/` + id, item)
  return response.data
}

export async function deleteZonaApi (id) {
  const response = await axios.delete(`${API_URL}/api/zonas/` + id)
  console.log(`${API_URL}/api/zonas/` + id)
  console.log(response)
  return response.data
}

export async function darBajaZonaApi (id) {
  const response = await axios.post(`${API_URL}/api/zonas/darbaja/` + id)
  return response.data
}
export async function activarZonaApi (id) {
  const response = await axios.post(`${API_URL}/api/zonas/activar/` + id)
  return response.data
}
