import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function dameMetricaApi (id) {
  const response = await axios.get(`${API_URL}/api/metricas/show/` + id)
  console.log(response)
  return response.data
}

export async function listarMetricaApi (pIdEvento,pIncluyeBajas = 'N') {
  console.log(pIdEvento)
  const response = await axios.get(`${API_URL}/api/metricas/evento/${pIdEvento}`, { 
    params: { pIncluyeBajas: pIncluyeBajas, pIdEvento:pIdEvento }
  })
  console.log(response)
  return response.data
}

export async function storeMetricaApi (item) {
  const response = await axios.post(`${API_URL}/api/metricas`, item)
  console.log(response)
  return response.data
}
export async function updateMetricaApi (item, id) {
  delete item.id
  const response = await axios.put(`${API_URL}/api/metricas/` + id, item)
  return response.data
}

export async function deleteMetricaApi (id) {
  const response = await axios.delete(`${API_URL}/api/metricas/` + id)
  console.log(`${API_URL}/api/metricas/` + id)
  console.log(response)
  return response.data
}

export async function darBajaMetricaApi (id) {
  const response = await axios.post(`${API_URL}/api/metricas/darbaja/` + id)
  return response.data
}
export async function activarMetricaApi (id) {
  const response = await axios.post(`${API_URL}/api/metricas/activar/` + id)
  return response.data
}
