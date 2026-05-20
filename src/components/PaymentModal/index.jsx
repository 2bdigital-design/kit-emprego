import { useState } from 'react'
import { useKitStore } from '../../store/kitStore'

const METODOS = [
  { id: 'multicaixa', label: 'Multicaixa Express', icone: '📱', instrucao: 'Envia para o número 923 XXX XXX via Multicaixa Express', ref: 'Insere o número de referência da transacção' },
  { id: 'bai', label: 'Depósito BAI', icone: '🏦', instrucao: 'Conta BAI: 0006.0000.00.123456789.10', ref: 'Número do comprovativo de depósito' },
  { id: 'bfa', label: 'Depósito BFA', icone: '🏦', instrucao: 'Conta BFA: 0040.0000.00.987654321.50', ref: 'Número do comprovativo de depósito' },
  { id: 'bic', label: 'Transferência BIC', icone: '🏦', instrucao: 'IBAN: AO06.0040.0000.00.987654321.50', ref: 'Referência da transferência' }
]

const PRECO = '5.000 Kz'

export default function PaymentModal() {
  const { auth, modelo, pessoal, resultado, vaga, experiencias, formacao, competencias, setEcra, atualizarUser } = useKitStore()
  const [passo, setPasso] = useState(1) // 1 = escolher método, 2 = instruções + referência
  const [metodoId, setMetodoId] = useState(null)
  const [referencia, setReferencia] = useState('')
  const [notas, setNotas] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const cor = modelo?.corPrimaria || '#2563eb'
  const metodo = METODOS.find(m => m.id === metodoId)

  async function guardarKit() {
    try {
      await fetch('/api/kit/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ dados: { pessoal, experiencias, formacao, competencias, vaga }, resultado, modeloId: modelo?.id })
      })
    } catch {}
  }

  async function submeterPagamento() {
    setErro('')
    if (!referencia.trim()) return setErro('Insere a referência ou comprovativo.')
    setCarregando(true)
    try {
      await guardarKit()
      const res = await fetch('/api/pagamento/submeter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ metodo: metodo.label, referencia, valor: PRECO, notas })
      })
      const data = await res.json()
      if (!res.ok) return setErro(data.erro || 'Erro ao registar pagamento.')
      setEcra('aguardar')
    } catch {
      setErro('Erro de ligação. Tenta novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => passo === 2 ? setPasso(1) : setEcra('preview')} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="font-bold text-gray-900">Guardar Kit de Emprego</h2>
          <p className="text-xs text-gray-400">Passo {passo} de 2</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {passo === 1 ? (
          <>
            {/* O que inclui */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">O que recebes</h3>
                <span className="text-2xl font-black" style={{ color: cor }}>{PRECO}</span>
              </div>
              {[
                { icone: '🖨️', texto: 'CV em PDF pronto a imprimir e enviar' },
                { icone: '✉️', texto: 'Carta de Apresentação em PDF' },
                { icone: '🎨', texto: 'Gera o mesmo kit em qualquer outro tema' },
                { icone: '💾', texto: 'Kit guardado na tua conta para acesso futuro' },
                { icone: '📄', texto: 'Versão editável em Word (DOCX)' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-lg">{item.icone}</span>
                  <span className="text-sm text-gray-700">{item.texto}</span>
                </div>
              ))}
            </div>

            {/* Métodos */}
            <h3 className="font-semibold text-gray-700 mb-3">Escolhe o método de pagamento</h3>
            <div className="space-y-2 mb-6">
              {METODOS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMetodoId(m.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                    ${metodoId === m.id ? 'border-transparent shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                  style={metodoId === m.id ? { borderColor: cor, background: `${cor}08` } : {}}
                >
                  <span className="text-xl">{m.icone}</span>
                  <span className="font-medium text-gray-800 text-sm">{m.label}</span>
                  {metodoId === m.id && (
                    <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ background: cor }}>✓</div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => metodoId && setPasso(2)}
              disabled={!metodoId}
              className="w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{ background: cor }}
            >
              Continuar →
            </button>
          </>
        ) : (
          <>
            {/* Instruções de pagamento */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                <span className="text-2xl">{metodo.icone}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{metodo.label}</h3>
                  <p className="text-sm font-black" style={{ color: cor }}>{PRECO}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-amber-700 mb-1">📋 Instruções de pagamento</p>
                <p className="text-sm text-amber-800">{metodo.instrucao}</p>
              </div>

              <div>
                <label className="label">{metodo.ref} *</label>
                <input
                  className="input-field"
                  placeholder="Ex: TXN-20260520-001234"
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                />
              </div>

              <div className="mt-3">
                <label className="label">Notas adicionais <span className="text-gray-400 font-normal">(opcional)</span></label>
                <textarea
                  className="input-field resize-none h-20"
                  placeholder="Qualquer informação adicional sobre o pagamento..."
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
                />
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
                ⚠️ {erro}
              </div>
            )}

            <button
              onClick={submeterPagamento}
              disabled={carregando}
              className="w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: cor }}
            >
              {carregando ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>A registar...</>
              ) : '✅ Confirmar pagamento'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              O teu acesso será activado após confirmação do pagamento pelo administrador.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
