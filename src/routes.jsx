import { Route, Routes } from 'react-router-dom'
import GeneralLayout from './layout/GeneralLayout/GeneralLayout'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import PersonasPage from './pages/PersonasPage/PersonasPage'

const RoutesComponent = () => (
  <Routes>
    {/* RUTAS GENERALES */}
    {/* <Route path='/login' element={<Login />} /> */}
    <Route element={<GeneralLayout />}>
      <Route path='/'  element={<DashboardPage />} />
      <Route path='/personas'  element={<PersonasPage />} />
      <Route path='/cajas/test1'  element={<DashboardPage />} />
    </Route>
  </Routes>
)

export default RoutesComponent
