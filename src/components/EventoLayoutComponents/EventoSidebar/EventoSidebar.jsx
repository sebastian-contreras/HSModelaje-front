import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './EventosLayout.module.css' // Importa el CSS como un módulo
import { useEvento } from '../../../context/SidebarContext/EventoContext'
import { formatearFechayHora } from '../../../Fixes/formatter'
import { ESTADOS_EVENTOS, getLabelByValue } from '../../../Fixes/fixes'
import { dameEstablecimientoApi } from '../../../services/EstablecimientosService'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'

function EventoSidebar () {
  const navigate = useNavigate()
  const [Establecimiento, setEstablecimiento] = useState({})
  const location = useLocation()
  const { evento } = useEvento()
  const BASE_URL = '/eventos/' + evento?.IdEvento
  const rutas = useMemo(
    () => [
      { name: 'Dashboard', link: BASE_URL, icon: 'fa-home' },
      { name: 'Registros', separador: true },
      // { name: 'Personas', link: '/personas', icon: 'fa-user' },
      { name: 'Entradas', link: BASE_URL + '/entradas', icon: 'fa-ticket' },
      { name: 'Zonas', link: BASE_URL + '/zonas', icon: 'fa-location-dot' },
      {
        name: 'Patrocinadores',
        link: BASE_URL + '/patrocinadores',
        icon: 'fa-bullhorn'
      },
      { name: 'Gastos', link: BASE_URL + '/gastos', icon: 'fa-minus' },
      { name: 'Votacion', separador: true },
      { name: 'Votacion', link: BASE_URL + '/votacion', icon: 'fa-comment' },
      {
        name: 'Participantes',
        link: BASE_URL + '/participantes',
        icon: 'fa-person'
      },
      { name: 'Jueces', link: BASE_URL + '/jueces', icon: 'fa-gavel' },
      { name: 'Metricas', link: BASE_URL + '/metricas', icon: 'fa-circle' }
    ],
    [BASE_URL]
  )

  const TiposItemsNav = ({
    name = '',
    link = '',
    separador = false,
    subruta = null,
    icon = ''
  }) => {
    const isActive = location.pathname == link
    const firstRoute = location.pathname.split('/')
    const test = link.split('/')

    const subSectionActive = firstRoute[1] == test[1]
    if (separador) {
      return (
        <li className='nav-section'>
          <span className='sidebar-mini-icon'>
            <i className='fa fa-ellipsis-h'></i>
          </span>
          <h4 className='text-section'>{name}</h4>
        </li>
      )
    }
    if (!subruta) {
      return (
        <li
          className={`${styles['nav-item']} nav-item ${
            isActive ? 'active' : ''
          }`}
        >
          <Link to={link}>
            <i className={`${styles['link-color']} fas ${icon}`}></i>
            <p className={`${styles['link-color']}`}>{name}</p>
          </Link>
        </li>
      )
    }
    if (subruta) {
      return (
        <li className={`${styles['nav-item']} nav-item`}>
          <a
            data-bs-toggle='collapse'
            aria-expanded={subSectionActive}
            href={`#${name}`}
          >
            <i className={`${styles['link-color']} fas ${icon}`}></i>
            <p className={`${styles['link-color']}`}>{name}</p>
            <span className='caret'></span>
          </a>
          <div
            className={`collapse ${subSectionActive ? 'show' : ''}`}
            id={name}
          >
            <ul className='nav nav-collapse'>
              {subruta.map((subitem, index) => (
                <li
                  key={index}
                  className={`${
                    location.pathname == subitem.link ? 'active' : ''
                  }`}
                >
                  <Link to={subitem.link}>
                    <span className='sub-item'>{subitem.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      )
    }
  }

  useEffect(() => {
    if (evento) {
      dameEstablecimientoApi(evento.IdEvento).then(res => {
        console.log(res)
        setEstablecimiento(res.data[0])
      })
    }
  }, [evento])

  return (
    <aside className={`${styles.sidebar} sidebar`} data-background-color='dark'>
      <div className='sidebar-logo d-block'>
        {/* Logo Header  */}
        <div className='text-center'>
          <img
            src='/img/logo/logo_white.png'
            alt='navbar brand'
            className='mt-2'
            onClick={() => navigate('/eventos')}
            height='70'
          />
        </div>
        <div
          className={`${styles['logo-header']} text-center  py-5  w-100 justify-content-center mt-5`}
          data-background-color='dark'
        >
          <p className='fw-bold text-white mb-0 fs-5 mt-0'>Evento</p>
          <p className='fw-bold text-white fs-5 mb-0'>{evento?.Evento}</p>
          <p className='fw-medium text-white mb-0 mt-0'>
            Inicio:{' '}
            {formatearFechayHora(
              evento?.FechaInicio || evento?.FechaProbableInicio
            )}
          </p>
          <p className='fw-medium text-white mb-0'>
            Final:{' '}
            {formatearFechayHora(
              evento?.FechaFinal || evento?.FechaProbableFinal
            )}
          </p>
          <p className='fw-bold text-white mb-0 fs-5 mt-'>Lugar</p>
          <p className='text-white mt-0 mb-0'>
            {Establecimiento?.Establecimiento}
          </p>
          <p className='fw-medium text-white mb-0'>
            Estado: {getLabelByValue(ESTADOS_EVENTOS, evento?.EstadoEvento)}
          </p>
        </div>
        {/* End Logo Header */}
      </div>
      <div className='scrollbar scrollbar-inner d-block'>
        <div className=' sidebar-content'>
          <ul className='pt-3 nav nav-secondary'>
            {rutas.map((item, index) => (
              <TiposItemsNav key={index} {...item} />
            ))}

            {/* <li className="nav-item">
                <a href="widgets.html">
                  <i className="fas fa-desktop"></i>
                  <p>Widgets</p>
                  <span className="badge badge-success">4</span>
                </a>
              </li> */}

            {/* <li className="nav-item">
                <a data-bs-toggle="collapse" href="#submenu">
                  <i className="fas fa-bars"></i>
                  <p>Menu Levels</p>
                  <span className="caret"></span>
                </a>
                <div className="collapse" id="submenu">
                  <ul className="nav nav-collapse">
                    <li>
                      <a data-bs-toggle="collapse" href="#subnav1">
                        <span className="sub-item">Level 1</span>
                        <span className="caret"></span>
                      </a>
                      <div className="collapse" id="subnav1">
                        <ul className="nav nav-collapse subnav">
                          <li>
                            <a href="#">
                              <span className="sub-item">Level 2</span>
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <span className="sub-item">Level 2</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <a data-bs-toggle="collapse" href="#subnav2">
                        <span className="sub-item">Level 1</span>
                        <span className="caret"></span>
                      </a>
                      <div className="collapse" id="subnav2">
                        <ul className="nav nav-collapse subnav">
                          <li>
                            <a href="#">
                              <span className="sub-item">Level 2</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li>
                      <a href="#">
                        <span className="sub-item">Level 1</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li> */}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default EventoSidebar
