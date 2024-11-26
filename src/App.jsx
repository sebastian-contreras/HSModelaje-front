import { BrowserRouter, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import RoutesComponent from './routes'
import { AxiosInterceptor } from './interceptors/Axios.interceptor'

function App () {
  AxiosInterceptor()
  return (
    <>
      <BrowserRouter>
        <RoutesComponent />
      </BrowserRouter>
    </>
  )
}

export default App
