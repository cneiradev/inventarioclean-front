import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

/**
 * Avisos de exito y error.
 *
 * <p>El documento pide responder con un mensaje de "Exito" o, si falla, un
 * mensaje de error que diga exactamente que paso. El backend ya devuelve
 * mensajes claros; este componente solo los muestra y los deja
 * desaparecer solos.
 */

type Aviso = {
  id: number
  texto: string
  tipo: 'exito' | 'error'
}

type AvisosValue = {
  exito: (texto: string) => void
  error: (texto: string) => void
}

const AvisosContext = createContext<AvisosValue | null>(null)

const DURACION_MS = 4000

export function ProveedorAvisos({ children }: { children: React.ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([])

  const mostrar = useCallback((texto: string, tipo: Aviso['tipo']) => {
    const id = Date.now() + Math.random()
    setAvisos((previos) => [...previos, { id, texto, tipo }])
    setTimeout(() => {
      setAvisos((previos) => previos.filter((a) => a.id !== id))
    }, DURACION_MS)
  }, [])

  const exito = useCallback((texto: string) => mostrar(texto, 'exito'), [mostrar])
  const error = useCallback((texto: string) => mostrar(texto, 'error'), [mostrar])

  const valor = useMemo(() => ({ exito, error }), [exito, error])

  return (
    <AvisosContext.Provider value={valor}>
      {children}

      {/* Contenedor fijo: no mueve el layout al aparecer el aviso. */}
      {avisos.length > 0 && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
          {avisos.map((aviso) => (
            <div
              key={aviso.id}
              role="status"
              className={[
                'pointer-events-auto rounded-lg px-4 py-3 text-sm text-white shadow-lg',
                aviso.tipo === 'exito' ? 'bg-emerald-600' : 'bg-red-600',
              ].join(' ')}
            >
              {aviso.texto}
            </div>
          ))}
        </div>
      )}
    </AvisosContext.Provider>
  )
}

export function useAvisos(): AvisosValue {
  const contexto = useContext(AvisosContext)
  if (!contexto) {
    throw new Error('useAvisos debe usarse dentro de <ProveedorAvisos>')
  }
  return contexto
}