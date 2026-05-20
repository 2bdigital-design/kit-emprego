import { useState } from 'react'
import { useKitStore } from '../../store/kitStore'

function formatarWA(valor) {
  if (valor.includes('@')) return valor
  const digitos = valor.replace(/\D/g, '')
  if (digitos.length <= 3) return digitos
  if (digitos.length <= 6) return `${digitos.slice(0,3)} ${digitos.slice(3)}`
  if (digitos.length <= 9) return `${digitos.slice(0,3)} ${digitos.slice(3,6)} ${digitos.slice(6)}`
  return `${digitos.slice(0,3)} ${digitos.slice(3,6)} ${digitos.slice(6,9)}`
}

export default function Auth() {
  const setAuth = useKitStore(s => s.setAuth)
  const [modo, setModo] = useState('login') // login | cadastro
  const [whatsapp, setWhatsapp] = useState('')
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function submeter(e) {
    e.preventDefault()
    setErro('')

    if (modo === 'cadastro') {
      if (!nome.trim()) return setErro('O nome é obrigatório.')
      if (senha !== confirmar) return setErro('As senhas não coincidem.')
    }

    setCarregando(true)
    try {
      const endpoint = modo === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = modo === 'login'
        ? { whatsapp, senha }
        : { whatsapp, senha, nome }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) return setErro(data.erro || 'Erro ao processar o pedido.')
      setAuth(data)
    } catch {
      setErro('Sem ligação ao servidor. Verifica a tua conexão.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-2xl font-black text-brand-700">KE</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Kit de Emprego</h1>
          <p className="text-brand-200 text-sm mt-1">O teu CV profissional com IA</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {['login', 'cadastro'].map(m => (
              <button
                key={m}
                onClick={() => { setModo(m); setErro('') }}
                className={`flex-1 py-4 text-sm font-semibold transition-all duration-200
                  ${modo === m ? 'text-brand-700 border-b-2 border-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <form onSubmit={submeter} className="p-6 space-y-4">
            {modo === 'cadastro' && (
              <div>
                <label className="label">Nome completo</label>
                <input
                  className="input-field"
                  placeholder="Ex: Maria Santos"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="label">Número de WhatsApp</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="text-gray-400 text-sm font-medium">🇦🇴 +244</span>
                </div>
                <input
                  className="input-field pl-24"
                  placeholder="9XX XXX XXX"
                  value={whatsapp}
                  onChange={e => setWhatsapp(formatarWA(e.target.value))}
                  inputMode="tel"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  className="input-field pr-12"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder={modo === 'cadastro' ? 'Mínimo 6 caracteres' : 'A tua senha'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarSenha ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {modo === 'cadastro' && (
              <div>
                <label className="label">Confirmar senha</label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="Repete a senha"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  required
                />
              </div>
            )}

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                <span className="flex-shrink-0">⚠️</span>
                <span>{erro}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {carregando ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  A processar...
                </>
              ) : modo === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-brand-300 text-xs mt-6">Kit de Emprego © 2026</p>
      </div>
    </div>
  )
}
