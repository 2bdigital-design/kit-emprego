import { useState, useEffect } from 'react'
import { useKitStore } from '../../store/kitStore'

export default function AdminPanel() {
  const { setEcra, auth, logout } = useKitStore()
  const [aba, setAba] = useState('pendentes')
  const [pendentes, setPendentes] = useState([])
  const [utilizadores, setUtilizadores] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [toast, setToast] = useState('')

  const headers = { Authorization: `Bearer ${auth?.token}` }

  function mostrarToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function carregarDados() {
    setCarregando(true)
    try {
      const [resPend, resUsers] = await Promise.all([
        fetch('/api/admin/pendentes', { headers }),
        fetch('/api/admin/usuarios', { headers })
      ])
      if (!resPend.ok || !resUsers.ok) { logout(); return }
      setPendentes(await resPend.json())
      setUtilizadores(await resUsers.json())
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregarDados() }, [])

  async function aprovar(userId) {
    await fetch(`/api/admin/aprovar/${userId}`, { method: 'POST', headers })
    mostrarToast('✅ Acesso activado com sucesso!')
    carregarDados()
  }

  async function revogar(userId) {
    if (!confirm('Revogar acesso pago deste utilizador?')) return
    await fetch(`/api/admin/revogar/${userId}`, { method: 'POST', headers })
    mostrarToast('🚫 Acesso revogado.')
    carregarDados()
  }

  async function rejeitarPagamento(pagId) {
    await fetch(`/api/admin/rejeitar/${pagId}`, { method: 'POST', headers })
    mostrarToast('❌ Pagamento rejeitado.')
    carregarDados()
  }

  function formatarData(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold">Painel Admin — Kit de Emprego</h1>
            <p className="text-gray-400 text-xs">
              {pendentes.length} pedido{pendentes.length !== 1 ? 's' : ''} pendente{pendentes.length !== 1 ? 's' : ''}
              · {utilizadores.filter(u => u.acessoPago).length} utilizador{utilizadores.filter(u => u.acessoPago).length !== 1 ? 'es' : ''} pagos
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => carregarDados()} disabled={carregando}
              className="text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
              {carregando ? '...' : '🔄'}
            </button>
            <button onClick={logout}
              className="text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-600 transition-all">
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-6">
            {[
              { id: 'pendentes', label: `Pendentes (${pendentes.length})` },
              { id: 'utilizadores', label: `Utilizadores (${utilizadores.length})` }
            ].map(tab => (
              <button key={tab.id} onClick={() => setAba(tab.id)}
                className={`py-4 text-sm font-semibold border-b-2 transition-all ${aba === tab.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {aba === 'pendentes' && (
          <div>
            {pendentes.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-medium">Nenhum pagamento pendente</p>
                <p className="text-sm mt-1">Todos os pedidos foram processados.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendentes.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex flex-wrap justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{p.nome || 'Sem nome'}</p>
                        <p className="text-sm text-gray-500">{p.whatsapp}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{p.valor}</p>
                        <p className="text-xs text-gray-400">{formatarData(p.criadoEm)}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 rounded-xl p-3 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs">Método</p>
                        <p className="font-medium text-gray-800">{p.metodo}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Referência</p>
                        <p className="font-medium text-gray-800 break-all">{p.referencia}</p>
                      </div>
                      {p.notas && (
                        <div className="col-span-2">
                          <p className="text-gray-400 text-xs">Notas</p>
                          <p className="text-gray-700">{p.notas}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => aprovar(p.userId)}
                        className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-all active:scale-95">
                        ✅ Aprovar e activar acesso
                      </button>
                      <button onClick={() => rejeitarPagamento(p.id)}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-sm transition-all">
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {aba === 'utilizadores' && (
          <div>
            {utilizadores.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">👥</div>
                <p>Nenhum utilizador registado ainda.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {utilizadores.map(u => (
                  <div key={u.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${u.acessoPago ? 'bg-green-500' : 'bg-gray-300'}`}>
                        {(u.nome || u.whatsapp).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{u.nome || '—'}</p>
                        <p className="text-xs text-gray-400">{u.whatsapp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.acessoPago ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.acessoPago ? '✅ Pago' : 'Gratuito'}
                      </span>
                      {u.acessoPago ? (
                        <button onClick={() => revogar(u.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-all">
                          Revogar
                        </button>
                      ) : (
                        <button onClick={() => aprovar(u.id)} className="text-xs text-green-600 hover:text-green-700 px-2 py-1 rounded-lg hover:bg-green-50 transition-all">
                          Activar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
