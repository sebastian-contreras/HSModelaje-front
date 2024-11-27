import { Route, Routes } from 'react-router-dom'
import GeneralLayout from './layout/GeneralLayout/GeneralLayout'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import PersonasPage from './pages/PersonasPage/PersonasPage'
import Login from './pages/Login/Login'
import CajasPage from './pages/CajasPage/CajasPage'
import ListadoContratoPage from './pages/ContratosPages/ListadoContratosPage.jsx/ListadoContratoPage'
import NuevoContratoPage from './pages/ContratosPages/NuevoContratoPage/NuevoContratoPage'

const RoutesComponent = () => (
  <Routes>
    {/* RUTAS GENERALES */}
    <Route path='/login' element={<Login />} />
    <Route element={<GeneralLayout />}>
      <Route path='/' element={<DashboardPage />} />
      <Route path='/personas' element={<PersonasPage />} />
      <Route path='/cajas' element={<CajasPage />} />
      <Route path='/contratos/' element={<ListadoContratoPage />} />
      <Route path='/contratos/nuevo' element={<NuevoContratoPage />} />
    </Route>
  </Routes>
)

export default RoutesComponent
