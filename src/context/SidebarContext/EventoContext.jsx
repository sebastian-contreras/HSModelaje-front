import { createContext, useContext, useState } from 'react'
import { Alerta } from '../../functions/alerts'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { dameEventoApi } from '../../services/EventosService'

const EventoContext = createContext()

export const EventoProvider = ({ children }) => {
  const [evento, setEvento] = useState(null)

  const refresh = ()=>{
    dameEventoApi(evento.IdEvento)
        .then(res => {
          console.log(res)
          if (!res.data) {
            Alerta()
              .withTipo('error')
              .withTitulo('Error al obtener el evento')
              .withMensaje('El evento no existe.')
              .withMini(true)
              .build()
            // return
          } else {
            console.log(res.data)
            document.title = res.data.Evento + " - HSModelaje";
            setEvento(res.data) // Guarda la información en el contexto
          }
        })
        .catch(err => {
          Alerta()
            .withTipo('error')
            .withTitulo('Error al obtener el evento')
            .withMensaje(
              err?.response?.data?.message
                ? err.response.data.message
                : MENSAJE_DEFAULT
            )
        })
  }

  return (
    <EventoContext.Provider value={{ evento, setEvento, refresh }}>
      {children}
    </EventoContext.Provider>
  )
}



export const useEvento = () => {
  return useContext(EventoContext)
}
