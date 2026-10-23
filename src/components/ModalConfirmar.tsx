import { Button } from './ui'

/**
 * Dialogo de confirmacion.
 *
 * <p>El documento pide expresamente que, antes de eliminar un producto, se
 * muestre su nombre y se pregunte si esta seguro. Este componente es ese
 * dialogo: muestra el mensaje con el detalle concreto y espera un "Si"
 * explicito, sin confirmar por descuido al hacer clic fuera o al presionar
 * Escape.
 */
export default function ModalConfirmar({
  titulo,
  mensaje,
  confirmar = 'Si, eliminar',
  textoCancelar = 'Cancelar',
  procesando = false,
  onConfirmar,
  onCancelar,
}: {
  titulo: string
  mensaje: React.ReactNode
  confirmar?: string
  textoCancelar?: string
  procesando?: boolean
  onConfirmar: () => void
  onCancelar: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">{titulo}</h2>
        </div>

        <div className="px-5 py-4 text-sm text-slate-600">{mensaje}</div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <Button
            variante="secundario"
            onClick={onCancelar}
            disabled={procesando}
          >
            {textoCancelar}
          </Button>
          <Button variante="peligro" onClick={onConfirmar} disabled={procesando}>
            {procesando ? 'Procesando...' : confirmar}
          </Button>
        </div>
      </div>
    </div>
  )
}