/**
 * Componentes base del panel.
 *
 * <p>Un panel con tablas densas se lee peor si cada pantalla inventa sus
 * clases. Estos componentes concentran la forma de los controles para que
 * el sitio se vea uniforme y para no repetir cadenas largas de utilidades.
 */

export function Card({
  titulo,
  descripcion,
  children,
  acciones,
}: {
  titulo?: string
  descripcion?: string
  children: React.ReactNode
  acciones?: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {(titulo || acciones) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            {titulo && (
              <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
            )}
            {descripcion && (
              <p className="mt-0.5 text-xs text-slate-500">{descripcion}</p>
            )}
          </div>
          {acciones}
        </header>
      )}
      {children}
    </section>
  )
}

export function Field({
  label,
  error,
  ayuda,
  children,
  htmlFor,
}: {
  label: string
  error?: string
  ayuda?: string
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {ayuda && !error && (
        <p className="mt-1 text-xs text-slate-500">{ayuda}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const controlClasses =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-marca-500 focus:ring-2 focus:ring-marca-100 disabled:bg-slate-50 disabled:text-slate-500'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...resto } = props
  return <input {...resto} className={`${controlClasses} ${className}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', ...resto } = props
  return <select {...resto} className={`${controlClasses} ${className}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...resto } = props
  return <textarea {...resto} className={`${controlClasses} ${className}`} />
}

type VarianteBoton = 'primario' | 'secundario' | 'peligro'

const variantes: Record<VarianteBoton, string> = {
  primario: 'bg-marca-600 text-white hover:bg-marca-700',
  secundario: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
  peligro: 'bg-red-600 text-white hover:bg-red-700',
}

export function Button({
  variante = 'primario',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: VarianteBoton }) {
  return (
    <button
      {...props}
      className={[
        'rounded-lg px-4 py-2 text-sm font-medium transition',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantes[variante],
        className,
      ].join(' ')}
    />
  )
}

/**
 * Badge de estado. El color lo decide la clase que le pase cada pantalla,
 * para que "stock bajo", "arrendado" o "inactivo" puedan tener su propio
 * criterio visual.
 */
export function Badge({
  children,
  tono = 'neutro',
}: {
  children: React.ReactNode
  tono?: 'neutro' | 'exito' | 'alerta' | 'peligro' | 'info'
}) {
  const tonos = {
    neutro: 'bg-slate-100 text-slate-700',
    exito: 'bg-emerald-100 text-emerald-800',
    alerta: 'bg-amber-100 text-amber-800',
    peligro: 'bg-red-100 text-red-800',
    info: 'bg-marca-100 text-marca-700',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tonos[tono]}`}
    >
      {children}
    </span>
  )
}

export function Vacio({ mensaje }: { mensaje: string }) {
  return (
    <p className="px-5 py-10 text-center text-sm text-slate-500">{mensaje}</p>
  )
}

export function Cargando() {
  return <p className="px-5 py-10 text-center text-sm text-slate-500">Cargando...</p>
}

/**
 * Tarjeta de indicador del panel.
 *
 * <p>El tono se elige segun la urgencia, no por decoracion: un numero en
 * rojo es una alarma, y si todos los numeros estan en rojo el panel deja de
 * servir para detectar problemas.
 */
export function Kpi({
  etiqueta,
  valor,
  detalle,
  tono = 'neutro',
}: {
  etiqueta: string
  valor: number | string
  detalle?: string
  tono?: 'neutro' | 'alerta' | 'peligro' | 'exito'
}) {
  const tonos = {
    neutro: 'text-slate-900',
    exito: 'text-emerald-700',
    alerta: 'text-amber-700',
    peligro: 'text-red-700',
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{etiqueta}</p>
      <p className={`mt-1 text-2xl font-semibold ${tonos[tono]}`}>{valor}</p>
      {detalle && <p className="mt-0.5 text-xs text-slate-500">{detalle}</p>}
    </div>
  )
}