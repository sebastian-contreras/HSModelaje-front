import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { EventoProvider } from './context/SidebarContext/EventoContext'
import { AxiosInterceptor } from './interceptors/Axios.interceptor'
import RoutesComponent from './routes'

function App () {
  AxiosInterceptor()
  return (
    <>
      <BrowserRouter>
        <EventoProvider>
          <RoutesComponent />
        </EventoProvider>
      </BrowserRouter>
    </>
  )
}

export default App
