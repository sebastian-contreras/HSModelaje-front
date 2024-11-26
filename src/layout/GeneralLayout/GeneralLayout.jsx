import { Outlet } from 'react-router-dom'
import GeneralFooter from '../../components/GeneralLayoutComponents/GeneralFooter/GeneralFooter'
import GeneralNavbar from '../../components/GeneralLayoutComponents/GeneralNavbar/GeneralNavbar'
import GeneralSidebar from '../../components/GeneralLayoutComponents/GeneralSidebar/GeneralSidebar'
import { useHandlerSidebar } from '../../context/SidebarContext/SidebarContext'
import ProtectedRoute from '../../security/ProtectedRoutes/ProtectedRoutes'
import { Collapse } from '@mui/material'

function GeneralLayout () {
  const { openSidebar } = useHandlerSidebar()
  return (
    <ProtectedRoute>
      <body>
        <div className='wrapper'>
        <Collapse in={openSidebar}  orientation="horizontal">
            <GeneralSidebar />
          </Collapse>
          <div className={openSidebar ? 'main-panel transition-main-panel':`main-panel transition-main-panel-full`}>
            <GeneralNavbar />
            <div className='container'>
              <div className='page-inner'>
                <Outlet />
              </div>
            <GeneralFooter />
            </div>
          </div>
        </div>
      </body>
    </ProtectedRoute>
  )
}

export default GeneralLayout
