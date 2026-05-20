import { useKitStore } from '../../store/kitStore'

const PASSOS = [
  { id: 'passo-1', numero: 1, label: 'Dados Pessoais' },
  { id: 'passo-2', numero: 2, label: 'Experiência' },
  { id: 'passo-3', numero: 3, label: 'Formação & Skills' },
  { id: 'passo-4', numero: 4, label: 'A Vaga' }
]

export default function ProgressBar() {
  const { ecra, modelo, setEcra } = useKitStore()
  const passoAtual = parseInt(ecra.replace('passo-', '')) || 0
  const cor = modelo?.corPrimaria || '#2563eb'

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Barra de progresso */}
        <div className="relative flex items-center justify-between mb-3">
          {/* Linha de fundo */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 z-0" />
          {/* Linha preenchida */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-0.5 z-0 transition-all duration-500"
            style={{
              left: 0,
              width: `${((passoAtual - 1) / 3) * 100}%`,
              background: cor
            }}
          />

          {PASSOS.map((passo) => {
            const concluido = passoAtual > passo.numero
            const ativo = passoAtual === passo.numero
            return (
              <button
                key={passo.id}
                onClick={() => concluido && setEcra(passo.id)}
                disabled={!concluido}
                className="relative z-10 flex flex-col items-center gap-1 group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2
                    ${ativo ? 'text-white scale-110 shadow-md' : ''}
                    ${concluido ? 'text-white cursor-pointer' : ''}
                    ${!ativo && !concluido ? 'text-gray-400 bg-white border-gray-200' : ''}`}
                  style={
                    ativo
                      ? { background: cor, borderColor: cor, boxShadow: `0 0 0 4px ${cor}22` }
                      : concluido
                        ? { background: cor, borderColor: cor }
                        : {}
                  }
                >
                  {concluido ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : passo.numero}
                </div>
              </button>
            )
          })}
        </div>

        {/* Labels */}
        <div className="flex justify-between">
          {PASSOS.map((passo) => {
            const ativo = passoAtual === passo.numero
            const concluido = passoAtual > passo.numero
            return (
              <span
                key={passo.id}
                className={`text-xs font-medium text-center transition-colors duration-200
                  ${ativo ? 'font-semibold' : ''}
                  ${concluido ? 'text-gray-500' : ''}
                  ${!ativo && !concluido ? 'text-gray-400' : ''}`}
                style={ativo ? { color: cor } : {}}
              >
                <span className="hidden sm:inline">{passo.label}</span>
                <span className="sm:hidden">{passo.numero}</span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
