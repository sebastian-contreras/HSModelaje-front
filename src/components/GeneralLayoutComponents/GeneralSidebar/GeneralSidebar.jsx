import { Collapse } from '@mui/material'
import { useState } from 'react'
import { useHandlerSidebar } from '../../../context/SidebarContext/SidebarContext'
import { Link, useLocation } from 'react-router-dom'

function GeneralSidebar () {
  const {pathname} = useLocation();
  const rutas = [
    { name: 'Dashboard', link: '/', icon: 'fa-home' },
    { name: 'Secciones', separador: true },
    { name: 'Personas', link: '/personas', icon: 'fa-user' },
    {
      name: 'Cajas',
      icon: 'fa-box',
      link:'/cajas',
      subruta: [
        { name: 'test1', link: '/cajas/test1' },
        { name: 'test2', link: '/cajas/test2' }
      ]
    }
  ]

  const TiposItemsNav = ({ name='', link='', separador=false, subruta=null, icon='' }) => {
    const isActive = pathname == link;
    const firstRoute = pathname.split('/')
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
          <a data-bs-toggle='collapse' aria-expanded={subSectionActive} href={`#${name}`}>
            <i className={`fas ${icon}`}></i>
            <p>{name}</p>
            <span className='caret'></span>
          </a>
          <div className={`collapse ${subSectionActive ? 'show':''}`} id={name}>
            <ul className='nav nav-collapse'>
              {subruta.map((subitem, index) => (
                <li key={index}  className={`${isActive ?'active':'' }`}>
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
    <div className='sidebar' data-background-color='dark'>
      <div className='sidebar-logo'>
        {/* Logo Header  */}
        <div className='logo-header' data-background-color='dark'>
          <a href='index.html' className='logo'>
            <img
              src='src/assets/img/logo/logo_light.svg'
              alt='navbar brand'
              className='navbar-brand'
              height='25'
            />
          </a>
        </div>
        {/* End Logo Header */}
      </div>
      <div className='sidebar-wrapper scrollbar scrollbar-inner'>
        <div className='sidebar-content'>
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
    </div>
  )
}

export default GeneralSidebar
