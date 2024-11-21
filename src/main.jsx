import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import './assets/js/fontIcons.js'
import './assets/css/fonts.css'
import { BackdropProvider } from './context/Backdrop/Backdrop.jsx'
import { SidebarProvider } from './context/SidebarContext/SidebarContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BackdropProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </BackdropProvider>
  </StrictMode>
)
