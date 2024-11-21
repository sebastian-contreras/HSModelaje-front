import { useState } from 'react'
import { useHandlerSidebar } from '../../../context/SidebarContext/SidebarContext'

function GeneralNavbar () {
  const [usuario, setUsuario] = useState('Sebastian Contreras')
  const  {toggle} = useHandlerSidebar()
  return (
    
    <div className='main-header'>
      <div className='main-header-logo'>
        <div className='logo-header' data-background-color='dark'>
          <a href='index.html' className='logo'>
            <img
              src='src/assets/img/logo/logo_light.svg'
              alt='navbar brand'
              className='navbar-brand'
              height='20'
            />
          </a>
          <div className='nav-toggle'>
            <button className='btn btn-toggle toggle-sidebar'>
              <i className='gg-menu-right'></i>
            </button>
            <button className='btn btn-toggle sidenav-toggler'>
              <i className='gg-menu-left'></i>
            </button>
          </div>
          <button className='topbar-toggler more'>
            <i className='gg-more-vertical-alt'></i>
          </button>
        </div>
      </div>
      <nav className='navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom'>
        <div
          style={{ width: '95%' }}
          className='d-flex justify-content-between'
        >
          <nav className='navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex'>
            <button onClick={toggle} className='btn btn-toggle toggle-sidebar'>
              <i className='gg-menu-right text-black'></i>
            </button>

            <div className='input-group ms-5'>
              <div className='input-group-prepend'>
                <button type='submit' className='btn btn-search pe-1'>
                  <i className='fa fa-search search-icon'></i>
                </button>
              </div>
              <input
                type='text'
                placeholder='Search ...'
                className='form-control'
              />
            </div>
          </nav>

          <ul className='navbar-nav topbar-nav ms-md-auto align-items-center'>
            <li className='nav-item topbar-user dropdown hidden-caret'>
              <a
                className='dropdown-toggle profile-pic'
                data-bs-toggle='dropdown'
                href='#'
                aria-expanded='false'
              >
                <div className='avatar-sm'>
                  <img
                    src='src/assets/img/profile.jpg'
                    alt='...'
                    className='avatar-img rounded-circle'
                  />
                </div>
                <span className='profile-username'>
                  <span className='fw-bold'>{usuario}</span>
                </span>
              </a>
              <ul className='dropdown-menu dropdown-user animated fadeIn'>
                <div className='dropdown-user-scroll scrollbar-outer'>
                  <li>
                    <div className='user-box'>
                      <div className='avatar-lg'>
                        <img
                          src='src/assets/img/profile.jpg'
                          alt='image profile'
                          className='avatar-img rounded'
                        />
                      </div>
                      <div className='u-text'>
                        <h4>{usuario}</h4>
                        {/* <p className="text-muted">hello@example.com</p> */}
                        <a
                          href='profile.html'
                          className='btn btn-xs btn-secondary btn-sm'
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className='dropdown-divider'></div>
                    {/* <a className="dropdown-item" href="#">My Profile</a>
                        <a className="dropdown-item" href="#">My Balance</a>
                        <a className="dropdown-item" href="#">Inbox</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#">Account Setting</a>
                        <div className="dropdown-divider"></div> */}
                    <a className='dropdown-item' href='#'>
                      Logout
                    </a>
                  </li>
                </div>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default GeneralNavbar
