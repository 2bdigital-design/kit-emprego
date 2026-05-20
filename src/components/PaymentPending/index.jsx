import { useState, useEffect } from 'react'
import { useKitStore } from '../../store/kitStore'

export default function PaymentPending() {
  const { auth, modelo, setEcra, atualizarUser } = useKitStore()
  const cor = modelo?.corPrimaria || '#2563eb'
  const [verificando, setVerificando] = useState(false)
  const [pagamento, setPagamento] = useState(null)

  async function verificarEstado() {
    setVerificando(true)
    try {
      // Verificar estado do utilizador
      const resUser = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      const user = await resUser.json()

      if (user.acessoPago) {
        atualizarUser({ acessoPago: true })
        setEcra('preview')
        return
      }

      // Verificar estado do pagamento
      const resPag = await fetch('/api/pagamento/meu-estado', {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      const pag = await resPag.json()
      setPagamento(pag)
    } catch {
      // silencioso
    } finally {
      setVerificando(false)
    }
  }

  // Verifica automaticamente a cada 30 segundos
  useEffect(() => {
    verificarEstado()
    const interval = setInterval(verificarEstado, 30000)
    return () => clearInterval(interval)
  }, [])

  const estadoLabel = {
    pendente: { cor: '#F59E0B', icone: '⏳', label: 'Aguardando confirmação' },
    aprovado: { cor: '#10B981', icone: '✅', label: 'Aprovado!' },
    rejeitado: { cor: '#EF4444', icone: '❌', label: 'Rejeitado' },
    cancelado: { cor: '#6B7280', icone: '🚫', label: 'Cancelado' }
  }

  const estado = estadoLabel[pagamento?.estado] || estadoLabel['pendente']

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {/* Ícone animado */}
        <div
          className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg"
          style={{ background: cor }}
        >
          <span className="animate-pulse">⏳</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento submetido!</h2>
        <p className="text-gray-500 mb-6">
          O teu pagamento foi registado e está a aguardar confirmação pelo administrador. Serás notificado assim que for activado.
        </p>

        {/* Estado do pagamento */}
        {pagamento && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-3">Detalhes do pagamento</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Método</span>
                <span className="font-medium text-gray-900">{pagamento.metodo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Referência</span>
                <span className="font-medium text-gray-900">{pagamento.referencia}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valor</span>
                <span className="font-medium text-gray-900">{pagamento.valor}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-gray-500">Estado</span>
                <span className="font-semibold px-2 py-0.5 rounded-full text-xs text-white" style={{ background: estado.cor }}>
                  {estado.icone} {estado.label}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Acções */}
        <div className="space-y-3">
          <button
            onClick={verificarEstado}
            disabled={verificando}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: cor }}
          >
            {verificando ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>A verificar...</>
            ) : '🔄 Verificar estado'}
          </button>

          <button onClick={() => setEcra('preview')} className="w-full py-3 rounded-xl font-semibold text-gray-600 bg-white border border-gray-200 hover:border-gray-300 transition-all">
            ← Voltar ao CV
          </button>

          <button onClick={() => setEcra('pagamento')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">
            Alterar método de pagamento
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          A verificação é feita automaticamente a cada 30 segundos.
        </p>
      </div>
    </div>
  )
}
