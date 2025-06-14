import { Collapse, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import EventoSidebar from '../../components/EventoLayoutComponents/EventoSidebar/EventoSidebar'
import GeneralNavbar from '../../components/GeneralLayoutComponents/GeneralNavbar/GeneralNavbar'
import GeneralSidebar from '../../components/GeneralLayoutComponents/GeneralSidebar/GeneralSidebar'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import { useHandlerSidebar } from '../../context/SidebarContext/SidebarContext'
import { MENSAJE_DEFAULT } from '../../Fixes/messages'
import { Alerta } from '../../functions/alerts'
import ProtectedRoute from '../../security/ProtectedRoutes/ProtectedRoutes'
import { dameEventoApi } from '../../services/EventosService'

function GeneralLayout ({ tipo = 'ADMIN' }) {
  const navigate = useNavigate()

  const { openSidebar } = useHandlerSidebar()
  const { evento, setEvento } = useEvento() // Usa el contexto
  const { id } = useParams() // Obtén el ID de la ruta
  const [Loading, setLoading] = useState(false)
  const [Error, setError] = useState(false)

  useEffect(() => {
    console.log('ejecuta')

    if (tipo == 'EVENTO' && id && !evento) {
      setLoading(true)
      dameEventoApi(id)
        .then(res => {
          if (!res.data.length) {
            console.log('entra')
            navigate('/')
            Alerta()
              .withTipo('error')
              .withTitulo('Error al obtener el evento')
              .withMensaje('El evento no existe.')
              .withMini(true)
              .build()
            return
          } else {
            console.log('fuarda evento')
            document.title = res.data[0].Evento + " - HSModelaje";
            setEvento(res.data[0]) // Guarda la información en el contexto
          }
        })
        .catch(err => {
          navigate('/')
          Alerta()
            .withTipo('error')
            .withTitulo('Error al obtener el evento')
            .withMensaje(
              err?.response?.data?.message
                ? err.response.data.message
                : MENSAJE_DEFAULT
            )
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [tipo, id, setEvento, navigate,evento])

  return (
      <body>
        <div className='wrapper'>
          <Collapse in={openSidebar} orientation='horizontal'>
            {tipo == 'EVENTO' ? (
              <EventoSidebar />
            ) : (
              <GeneralSidebar />
            )}
          </Collapse>
          <div
            className={
              openSidebar
                ? 'main-panel transition-main-panel'
                : `main-panel transition-main-panel-full`
            }
          >
            <GeneralNavbar />
            <div className='container'>
              <div className='page-inner'>
                {Loading ? <Skeleton /> : <Outlet />}
              </div>
              {/* <GeneralFooter /> */}
            </div>
          </div>
        </div>
      </body>
  )
}

export default GeneralLayout
