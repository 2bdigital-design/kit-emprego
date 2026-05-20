import { useState } from 'react'
import { useKitStore } from '../../store/kitStore'

const SUGESTOES = [
  'Torna o resumo mais impactante',
  'Faz a carta mais formal',
  'Destaca mais a minha experiência em liderança',
  'Reduz o tamanho da carta',
  'Adiciona mais foco nas competências técnicas',
  'Torna a abertura da carta mais original'
]

export default function AIChat({ onClose }) {
  const { modelo, pessoal, experiencias, formacao, competencias, vaga, resultado, setResultado, auth } = useKitStore()
  const [instrucao, setInstrucao] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mensagens, setMensagens] = useState([])
  const cor = modelo?.corPrimaria || '#2563eb'

  async function ajustar(texto) {
    const instrucaoFinal = texto || instrucao
    if (!instrucaoFinal.trim()) return

    setCarregando(true)
    setMensagens(m => [...m, { tipo: 'user', texto: instrucaoFinal }])
    setInstrucao('')

    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({
          resultado,
          instrucao: instrucaoFinal,
          dados: { pessoal, experiencias, formacao, competencias, vaga }
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erro desconhecido.')

      setResultado({
        ...resultado,
        resumoProfissional: data.resumoProfissional,
        experienciasOtimizadas: data.experienciasOtimizadas,
        competenciasOrdenadas: data.competenciasOrdenadas,
        cartaApresentacao: data.cartaApresentacao
      })

      setMensagens(m => [...m, { tipo: 'ai', texto: '✅ Kit atualizado com sucesso! Consulta a pré-visualização.' }])
    } catch (err) {
      setMensagens(m => [...m, { tipo: 'erro', texto: `Erro: ${err.message}` }])
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
          style={{ borderTop: `3px solid ${cor}` }}>
          <div>
            <h3 className="font-bold text-gray-900">Ajustar com IA</h3>
            <p className="text-xs text-gray-500">O kit atualiza em tempo real</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Histórico */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {mensagens.length === 0 && (
            <div className="text-center py-8">
              <div className="text-3xl mb-3">✨</div>
              <p className="text-sm text-gray-500">Pede um ajuste ao teu kit em linguagem natural.</p>
            </div>
          )}
          {mensagens.map((m, i) => (
            <div key={i} className={`flex ${m.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${
                  m.tipo === 'user'
                    ? 'text-white rounded-br-sm'
                    : m.tipo === 'erro'
                      ? 'bg-red-50 text-red-700 rounded-bl-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
                style={m.tipo === 'user' ? { background: cor } : {}}
              >
                {m.texto}
              </div>
            </div>
          ))}
          {carregando && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sugestões */}
        <div className="px-5 pb-3">
          <p className="text-xs text-gray-400 mb-2">Sugestões rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {SUGESTOES.map(s => (
              <button
                key={s}
                onClick={() => ajustar(s)}
                disabled={carregando}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-5 pb-5 border-t border-gray-100 pt-3">
          <div className="flex gap-2">
            <input
              className="input-field text-sm flex-1"
              placeholder="Ex: Torna o resumo mais direto..."
              value={instrucao}
              onChange={e => setInstrucao(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !carregando && ajustar()}
              disabled={carregando}
            />
            <button
              onClick={() => ajustar()}
              disabled={!instrucao.trim() || carregando}
              className="px-4 py-2 rounded-xl text-white font-semibold transition-all disabled:opacity-50 flex-shrink-0"
              style={{ background: cor }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
