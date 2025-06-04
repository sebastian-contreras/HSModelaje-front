import axios from '../config/AxiosConfig.js'
import { API_URL } from '../Fixes/API_URL.js'

export async function InicioVotacionModeloApi (IdModelo) {
  const response = await axios.get(`${API_URL}/api/votacion/modelo/` + IdModelo)
  console.log(response)
  return response.data
}

