/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del backend en produccion. Vacio en desarrollo (usa el proxy). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
