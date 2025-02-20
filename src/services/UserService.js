import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function listarUsuarioApi (pIncluyeBajas = true) {
  const response = await axios.get(`${API_URL}/api/usuarios`, {
    params: { pIncluyeBajas: pIncluyeBajas }
  }
)
  console.log(response)
  return response.data
}

export async function meUsuarioApi () {
  const response = await axios.get(`${API_URL}/api/me`)
  console.log(response)
  return response.data
}
export async function storeUsuarioApi (usuario) {
  const response = await axios.post(`${API_URL}/api/usuarios`, usuario)
  console.log(response)
  return response.data
}
export async function updateUsuarioApi (usuario, id) {
  delete usuario.id
  const response = await axios.put(`${API_URL}/api/usuarios/` + id, usuario)
  return response.data
}

export async function deleteUsuarioApi (id) {
  const response = await axios.delete(`${API_URL}/api/usuarios/` + id)
  console.log(`${API_URL}/api/usuarios/` + id)
  console.log(response)
  return response.data
}
