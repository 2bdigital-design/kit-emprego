import { useState, useEffect } from 'react'
import { useKitStore } from '../../store/kitStore'

const ESTADOS = [
  { texto: 'A analisar o teu perfil e a vaga...', icon: '🔍' },
  { texto: 'A otimizar o teu percurso para esta posição...', icon: '⚙️' },
  { texto: 'A redigir a carta de apresentação...', icon: '✍️' },
  { texto: 'A finalizar os teus documentos...', icon: '✨' }
]

export default function Loading() {
  const [estadoIdx, setEstadoIdx] = useState(0)
  const [progresso, setProgresso] = useState(5)
  const modelo = useKitStore(s => s.modelo)
  const cor = modelo?.corPrimaria || '#2563eb'

  useEffect(() => {
    const intervalos = [2000, 2000, 3000, 3000]
    let idx = 0

    const avancar = () => {
      if (idx < ESTADOS.length - 1) {
        idx++
        setEstadoIdx(idx)
        setProgresso(Math.round(((idx + 1) / ESTADOS.length) * 90))
        setTimeout(avancar, intervalos[idx] || 2000)
      }
    }

    const timer = setTimeout(avancar, intervalos[0])

    const progressInterval = setInterval(() => {
      setProgresso(p => Math.min(p + 1, 92))
    }, 200)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [])

  const estado = ESTADOS[estadoIdx]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone animado */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-lg"
          style={{ background: cor }}
        >
          <span className="animate-bounce">{estado.icon}</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">A criar o teu kit...</h2>
        <p className="text-gray-500 mb-8 h-6 transition-all duration-500 pulse-text">
          {estado.texto}
        </p>

        {/* Barra de progresso */}
        <div className="bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progresso}%`, background: cor }}
          />
        </div>
        <p className="text-xs text-gray-400">{progresso}%</p>

        {/* Passos */}
        <div className="mt-10 space-y-3">
          {ESTADOS.map((e, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${i < estadoIdx ? 'opacity-50' : ''}
                ${i === estadoIdx ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            >
              <div
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{
                  background: i <= estadoIdx ? cor : '#e2e8f0',
                  color: i <= estadoIdx ? 'white' : '#94a3b8'
                }}
              >
                {i < estadoIdx ? '✓' : i + 1}
              </div>
              <span className={`text-sm text-left ${i === estadoIdx ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                {e.texto}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
