/**
 * Cliente HTTP de la API.
 *
 * En desarrollo las llamadas van a rutas relativas (/api/...) porque Vite
 * hace proxy al backend (ver vite.config.ts), asi no hay CORS ni URLs
 * distintas entre desarrollo y produccion.
 *
 * En produccion el frontend (Vercel) y el backend (Railway) estan en
 * dominios distintos, por lo que VITE_API_URL apunta al backend y el CORS
 * lo resuelve el backend (ver CorsConfig).
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

/** Token JWT en memoria + localStorage para sobrevivir a un refresh. */
const TOKEN_KEY = 'inventario-ar.token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/** Error de la API con el mensaje que devuelve el backend. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public campos?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Si es false, no se adjunta el token (login, por ejemplo). */
  auth?: boolean
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (auth && token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 204) return undefined as T

  const texto = await response.text()
  const datos = texto ? JSON.parse(texto) : null

  if (!response.ok) {
    // 401: el token expiro o es invalido. Se limpia para que el frontend
    // devuelva al usuario a la pantalla de login en vez de insistir.
    if (response.status === 401) clearToken()

    throw new ApiError(
      response.status,
      datos?.error ?? 'Ocurrio un error inesperado',
      datos?.campos,
    )
  }

  return datos as T
}
