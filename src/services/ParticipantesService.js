import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function buscarParticipanteApi (data) {
  console.log(data)
  const response = await axios.get(`${API_URL}/api/participantes/busqueda`,{
    params: data
  })
  return response.data
}

export async function storeParticipanteApi (item) {
  const response = await axios.post(`${API_URL}/api/participantes`, item)
  console.log(response)
  return response.data
}

export async function deleteParticipanteApi (id) {
  const response = await axios.delete(`${API_URL}/api/participantes/` + id)
  console.log(`${API_URL}/api/participantes/` + id)
  console.log(response)
  return response.data
}
