import { Outlet } from 'react-router-dom'
import GeneralFooter from '../../components/GeneralLayoutComponents/GeneralFooter/GeneralFooter'
import GeneralNavbar from '../../components/GeneralLayoutComponents/GeneralNavbar/GeneralNavbar'
import GeneralSidebar from '../../components/GeneralLayoutComponents/GeneralSidebar/GeneralSidebar'
import { useHandlerSidebar } from '../../context/SidebarContext/SidebarContext'
import { Collapse } from 'react-bootstrap'
import ProtectedRoute from '../../security/ProtectedRoutes/ProtectedRoutes'

function GeneralLayout () {
  const { openSidebar } = useHandlerSidebar()
  return (
    <ProtectedRoute>
      <body>
        <div className='wrapper'>
          <Collapse dimension='width' in={openSidebar}>
            <GeneralSidebar />
          </Collapse>
          <div className='main-panel'>
            <GeneralNavbar />
            <div className='container'>
              <div className='page-inner'>
                <Outlet />
              </div>
            </div>
            <GeneralFooter />
          </div>
        </div>
      </body>
    </ProtectedRoute>
  )
}

export default GeneralLayout
