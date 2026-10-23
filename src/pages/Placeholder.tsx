/** Marcador de posicion para las paginas que llegan en las fases siguientes. */
export default function Placeholder({ titulo }: { titulo: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{titulo}</h1>
      <p className="mt-1 text-sm text-slate-500">Esta seccion se implementa en una fase posterior.</p>
    </div>
  )
}
