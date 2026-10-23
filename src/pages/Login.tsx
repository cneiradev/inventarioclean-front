import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { useAuth } from '../lib/auth'

/**
 * Pantalla de login.
 *
 * El backend responde errores con un mensaje legible en espanol (ver
 * GlobalExceptionHandler), asi que se muestra tal cual: el cliente pidio
 * saber exactamente que paso.
 */
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, estaAutenticado } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  // Si ya hay sesion, no tiene sentido mostrar el login.
  if (estaAutenticado) return <Navigate to="/" replace />

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setEnviando(true)

    try {
      await login(username, password)
      // Vuelve a la pagina que el usuario intentaba abrir, si el guard la guardo.
      const destino = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(destino, { replace: true })
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : 'No se pudo conectar con el servidor',
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Inventario Clean</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ingresa para administrar la bodega
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                Usuario
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="FPEREZ"
                autoComplete="username"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Contrasena
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-marca-500 focus:ring-2 focus:ring-marca-100"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-lg bg-marca-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-marca-700 disabled:opacity-60"
            >
              {enviando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
