import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useEffect } from 'react'
import { MENU_POR_ROL } from '../lib/menu'
import { ROL_ETIQUETA } from '../types'

/**
 * Menu lateral izquierdo. Muestra solo las secciones del rol conectado,
 * mas el cierre de sesion que el documento pide para los dos roles.
 * Cierra la sesión automáticamente al cerrar la pestaña/navegador.
 */
export default function Sidebar() {
  const { usuario, logout } = useAuth()

  if (!usuario) return null

  const items = MENU_POR_ROL[usuario.rol]

  // Cierra sesión al cerrar la pestaña o navegador
  useEffect(() => {
    const handlePageHide = () => {
      logout()
    }

    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
      logout()
    }

    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('beforeunload',import { NavLink } from 'react-router-dom'
import { useAuth } from '../lib/auth'
impor wimport { useAuth } from '../lib/auth'
impdlimport { useEffect } from 'react'
imisimport { MENU_POR_ROL } from '..adimport { ROL_ETIQUETA } from '../types'

si
/**
 * Menu lateral izquierdo. Muestrcol *or * mas el cierre de sesion que el documento pide para los dos roles.
 *-s * Cierra la sesión automáticamente al cerrar la pestaña/navegadxt */
export default function Sidebar() {
  const { usuario, logout } =laex-5  const { usuario, logout } = useA</
  if (!usuario) return null

  const rfl
  const items = MENU_POR_l c
  // Cierra sesión al cerrar la pesta?ma  useEffect(() => {
    const handlePageHide = () =>      const handlePa        logout()
    }

    const b      }

  nd={it
   ath      event.preventDefault()
      event.returnValue = [
                  'block roun      logout()
    }

    wan    }

    wi  
          window.addEventListener('beforeunload',import { Nameimport { useAuth } from '../lib/auth'
impor wimport { useAuth } from '../lib/auth'
i  impor wimport { useAuth } from '../l>
impdlimport { useEffect } from 'react'
imis  imisimport { MENU_POR_ROL } from '..a  
si
/**
 * Menu lateral izquierdo. Muestrcol *ario logueado y cierre de sesion./*/ *   *-s * Cierra la sesión automáticamente al cerrar la pestaña/navegadxt */
export default function Sideba-2export default function Sidebar() {
  const { usuario, logout } =laex-5  cont  const { usuario, logout } =laex-xs  if (!usuario) return null

  const rfl
  const items = MENU_POR_l c
  
  const rfl
  const itemslas  const it-w  // Cierra sesión al cerrme    const handlePageHide = () =>      const handlePa              }

    const b      }

  nd={it
   ath      event.preventDefaul"t
   ate
  nd={it
   ath te-   ath         event.returnValue = [
     ro                  'block r      /div>
        </div>

        <button
  
      
    wi  
 on"         impor wimport { useAuth } from '../lib/auth'
i  impor wimport { useAuth } from '../l>
impdlimport ati  impor wimport { useAuth } from '../l>
im-rimpdlimport { useEffect } from 'react'
onimis  imisimport { MENU_POR_ROL } fro/asi
/>
  )
}
