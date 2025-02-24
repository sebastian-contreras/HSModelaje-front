import { Route, Routes } from 'react-router-dom'
import GeneralLayout from './layout/GeneralLayout/GeneralLayout'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import Login from './pages/Login/Login'
import PersonasPage from './pages/PersonasPage/PersonasPage'
import UsuariosPage from './pages/UsuariosPage/UsuariosPage'
import EventosPage from './pages/EventosPage/EventosPage'
import EstablecimientosPage from './pages/EstablecimientosPage/EstablecimientosPage'

const RoutesComponent = () => (
  <Routes>
    {/* RUTAS GENERALES */}
    <Route path='/login' element={<Login />} />
    <Route element={<GeneralLayout />}>
      <Route path='/' element={<DashboardPage />} />
      <Route path='/personas' element={<PersonasPage />} />
      <Route path='/usuarios' element={<UsuariosPage />} />
      <Route path='/eventos' element={<EventosPage />} />
      <Route path='/establecimientos' element={<EstablecimientosPage/>} />
      {/* <Route path='/cajas' element={<CajasPage />} />
      <Route path='/contratos' element={<ListadoContratoPage />} />
      <Route path='/contratos/nuevo' element={<NuevoContratoPage />} /> */}
    </Route>
  </Routes>
)

export default RoutesComponent
