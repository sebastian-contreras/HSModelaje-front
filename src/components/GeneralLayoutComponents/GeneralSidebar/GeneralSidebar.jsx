import { Collapse } from '@mui/material'
import { useMemo, useState } from 'react'
import { useHandlerSidebar } from '../../../context/SidebarContext/SidebarContext'
import { Link, useLocation } from 'react-router-dom'

function GeneralSidebar () {
  const location = useLocation();
  const rutas = useMemo(()=>[
    // { name: 'Dashboard', link: '/', icon: 'fa-home' },
    { name: 'Secciones', separador: true },
    { name: 'Usuarios', link: '/usuarios', icon: 'fa-user-circle' },
    { name: 'Eventos', link: '/eventos', icon: 'fa-calendar' },
    { name: 'Establecimientos', link: '/establecimientos', icon: 'fa-house' },
    { name: 'Modelos', link: '/modelos', icon: 'fa-person' },
    { name: 'Verificar Entrada', link: '/guardia', icon: 'fa-check-to-slot' }, 
   
  ],[])

  const TiposItemsNav = ({ name='', link='', separador=false, subruta=null, icon='' }) => {
    const isActive = location.pathname == link;
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
        <li className={`nav-item ${isActive ?'active':'' }`}>
          <Link to={link}>
            <i className={`fas ${icon}`}></i>
            <p>{name}</p>
          </Link>
        </li>
      )
    }
    if (subruta) {
      return (
        <li className='nav-item'>
          <a data-bs-toggle="collapse" aria-expanded={subSectionActive} href={`#${name}`}>
            <i className={`fas ${icon}`}></i>
            <p>{name}</p>
            <span className='caret'></span>
          </a>
          <div className={`collapse ${subSectionActive ? 'show':''}`} id={name}>
            <ul className='nav nav-collapse'>
              {subruta.map((subitem, index) => (
                <li key={index}  className={`${location.pathname==subitem.link ?'active':'' }`}>
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
  return (
    <aside className='sidebar ' data-background-color='dark'>
      <div className='mt-4 d-block'>
        {/* Logo Header  */}
        <div className=' d-flex w-100 justify-content-center' data-background-color='dark'> 
            <img
              src='/logos-web/logo-color-completo.png'
              alt='navbar brand'
              height='150'
            />
        </div>
        {/* End Logo Header */}
      </div>
      <div className='scrollbar scrollbar-inner d-block'>
        <div className=' sidebar-content'>
          <ul className='nav nav-secondary'>
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

export default GeneralSidebar
