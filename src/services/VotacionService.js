import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function InicioVotacionModeloApi (IdParticipante) {
  const response = await axios.get(`${API_URL}/api/votos/iniciar-voto/` ,{
    params: {
      pIdParticipante: IdParticipante
    }
  })
  return response.data
}
export async function DetenerVotacionModeloApi (IdParticipante) {
  const response = await axios.get(`${API_URL}/api/votos/detener-voto/` ,{
    params: {
      pIdParticipante: IdParticipante
    }
  })
  return response.data
}

export async function listarVotacionApi (IdEvento) {
  const response = await axios.get(`${API_URL}/api/votos`, {
    params: {
      pIdEvento: IdEvento
    }
  })
  return response.data
}

export async function enviarVotacionJuezApi (data) {
  const response = await axios.post(`${API_URL}/api/votos`,data)
  return response.data
}

export async function reiniciarVotacionApi (data) {
  const response = await axios.get(`${API_URL}/api/votos/reiniciar-voto`,{
    params: {
      pIdParticipante: data
    }
  })
  return response.data
}
