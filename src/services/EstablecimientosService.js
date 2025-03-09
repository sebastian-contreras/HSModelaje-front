import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function listarEstablecimientoApi (pIncluyeBajas = true) {
  const response = await axios.get(`${API_URL}/api/establecimientos`, {
    params: { pIncluyeBajas: pIncluyeBajas }
  })
  console.log(response)
  return response.data
}

export async function dameEstablecimientoApi (id) {
  const response = await axios.get(`${API_URL}/api/establecimientos/` + id)
  return response.data
}

export async function storeEstablecimientoApi (usuario) {
  const response = await axios.post(`${API_URL}/api/establecimientos`, usuario)
  console.log(response)
  return response.data
}
export async function updateEstablecimientoApi (usuario, id) {
  delete usuario.id
  const response = await axios.put(
    `${API_URL}/api/establecimientos/` + id,
    usuario
  )
  return response.data
}

export async function deleteEstablecimientoApi (id) {
  const response = await axios.delete(`${API_URL}/api/establecimientos/` + id)
  console.log(`${API_URL}/api/establecimientos/` + id)
  console.log(response)
  return response.data
}

export async function darBajaEstablecimientoApi (id) {
  const response = await axios.post(
    `${API_URL}/api/establecimientos/darbaja/` + id
  )
  return response.data
}
export async function activarEstablecimientoApi (id) {
  const response = await axios.post(
    `${API_URL}/api/establecimientos/activar/` + id
  )
  return response.data
}
