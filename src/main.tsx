import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './lib/auth.tsx'
import { ProveedorAvisos } from './lib/avisos.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider envuelve a App: toda la app necesita saber si hay
          sesion y de que rol es, desde el router hasta el menu lateral. */}
      <AuthProvider>
        {/* ProveedorAvisos da el "Exito" o el error a todas las pantallas. */}
        <ProveedorAvisos>
          <App />
        </ProveedorAvisos>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
