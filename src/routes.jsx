import { Route, Routes } from 'react-router-dom'
import GeneralLayout from './layout/GeneralLayout/GeneralLayout'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import Login from './pages/Login/Login'
import PersonasPage from './pages/PersonasPage/PersonasPage'
import UsuariosPage from './pages/UsuariosPage/UsuariosPage'
import EventosPage from './pages/EventosPage/EventosPage'
import EstablecimientosPage from './pages/EstablecimientosPage/EstablecimientosPage'
import ModelosPage from './pages/ModelosPage/ModelosPage'
import GastosPage from './pages/GastosPage/GastosPage'
import PatrocinadoresPage from './pages/PatrocinadoresPage/PatrocinadoresPage'
import JuecesPage from './pages/JuecesPage/JuecesPage'
import ZonasPage from './pages/ZonasPage/ZonasPage'
import MetricasPage from './pages/MetricasPage/MetricasPage'
import EntradasPage from './pages/EntradasPage/EntradasPage'
import PasarelaPage from './pages/PasarelaPage/PasarelaPage'
import ParticipantesPage from './pages/ParticipantesPage/ParticipantesPage'

const RoutesComponent = () => (
  <Routes>
    {/* RUTAS GENERALES */}
    <Route path='/login' element={<Login />} />
    <Route path='/pasarela/:idTitulo' element={<PasarelaPage />} />
    <Route element={<GeneralLayout />}>
      <Route path='/' element={<DashboardPage />} />
      <Route path='/personas' element={<PersonasPage />} />
      <Route path='/usuarios' element={<UsuariosPage />} />
      <Route path='/eventos' element={<EventosPage />} />
      <Route path='/establecimientos' element={<EstablecimientosPage />} />
      <Route path='/modelos' element={<ModelosPage />} />
    </Route>
    <Route element={<GeneralLayout tipo='EVENTO' />}>
      <Route path='/eventos/:id/' element={<DashboardPage />} />
      <Route path='/eventos/:id/entradas' element={<EntradasPage />} />
      <Route path='/eventos/:id/zonas' element={<ZonasPage />} />
      <Route path='/eventos/:id/gastos' element={<GastosPage />} />
      <Route path='/eventos/:id/votacion' element={<DashboardPage />} />
      <Route path='/eventos/:id/modelos' element={<ModelosPage />} />
      <Route path='/eventos/:id/jueces' element={<JuecesPage />} />
      <Route
        path='/eventos/:id/patrocinadores'
        element={<PatrocinadoresPage />}
      />
      <Route
        path='/eventos/:id/participantes'
        element={<ParticipantesPage />}
      />
      <Route path='/eventos/:id/metricas' element={<MetricasPage />} />
    </Route>
  </Routes>
)

export default RoutesComponent
