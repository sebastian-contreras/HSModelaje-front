import { Route, Routes } from 'react-router-dom'
import GeneralLayout from './layout/GeneralLayout/GeneralLayout'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import PersonasPage from './pages/PersonasPage/PersonasPage'
import Login from './pages/Login/Login'
import CajasPage from './pages/CajasPage/CajasPage'

const RoutesComponent = () => (
  <Routes>
    {/* RUTAS GENERALES */}
      <Route path='/login'  element={<Login />} />
    <Route element={<GeneralLayout />}>
      <Route path='/'  element={<DashboardPage />} />
      <Route path='/personas'  element={<PersonasPage />} />
      <Route path='/cajas'  element={<CajasPage />} />
    </Route>
  </Routes>
)

export default RoutesComponent
