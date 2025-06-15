import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export const downloadInformeEvento = async (idEvento) => {
  try {
    const response = await axios.get(`${API_URL}/api/informes/${idEvento}`)

    const pdf = response.data.data.pdf
    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${pdf}`
    link.download = response.data.data.filename // Usa el nombre de archivo recibido
    link.click()

    const blob = new Blob(
      [
        new Uint8Array(
          atob(pdf)
            .split('')
            .map(c => c.charCodeAt(0))
        )
      ],
      { type: 'application/pdf' }
    )
    const urlblob = URL.createObjectURL(blob)
    window.open(urlblob, '_blank') // Abre el PDF en una nueva pestaña

    window.URL.revokeObjectURL(urlblob)
  } catch (error) {
    console.error('Error al descargar el PDF:', error)
  }
}

export async function dashboardApi (id) {
  const response = await axios.get(`${API_URL}/api/dashboard/` + id)
  return response.data
}

export const downloadInformeVotacion = async (idEvento) => {
  try {
    // const response = await axios.get(`${API_URL}/api/informes/${idEvento}`)
    const response = await axios.post(`${API_URL}/api/informe-votacion/`+idEvento)

    const pdf = response.data.data.pdf
    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${pdf}`
    link.download = response.data.data.filename // Usa el nombre de archivo recibido
    link.click()

    const blob = new Blob(
      [
        new Uint8Array(
          atob(pdf)
            .split('')
            .map(c => c.charCodeAt(0))
        )
      ],
      { type: 'application/pdf' }
    )
    const urlblob = URL.createObjectURL(blob)
    window.open(urlblob, '_blank') // Abre el PDF en una nueva pestaña

    window.URL.revokeObjectURL(urlblob)
  } catch (error) {
    console.error('Error al descargar el PDF:', error)
  }
}