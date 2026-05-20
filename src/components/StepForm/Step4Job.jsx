import { useState } from 'react'
import { useKitStore } from '../../store/kitStore'
import { SETORES, TONS_CARTA } from '../../config/models'

export default function Step4Job() {
  const { vaga, setVaga, setEcra, setResultado, resultado, pessoal, experiencias, formacao, competencias, modelo, auth } = useKitStore()
  const [erros, setErros] = useState({})
  const cor = modelo?.corPrimaria || '#2563eb'

  function atualizar(campo, valor) {
    setVaga({ ...vaga, [campo]: valor })
    if (erros[campo]) setErros(e => ({ ...e, [campo]: '' }))
  }

  function validar() {
    const novosErros = {}
    if (!vaga.cargo.trim()) novosErros.cargo = 'O cargo pretendido é obrigatório.'
    if (!vaga.empresa.trim()) novosErros.empresa = 'O nome da empresa é obrigatório.'
    if (!vaga.setor.trim()) novosErros.setor = 'O setor de atividade é obrigatório.'
    if (!vaga.descricao.trim() || vaga.descricao.length < 50) novosErros.descricao = 'Cola a descrição completa da vaga (mínimo 50 caracteres).'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function gerar() {
    if (!validar()) return

    setResultado({ ...resultado, loading: true, gerado: false, erro: null })
    setEcra('gerando')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({ pessoal, experiencias, formacao, competencias, vaga })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.erro || data.error || 'Erro desconhecido.')

      setResultado({
        gerado: true,
        loading: false,
        erro: null,
        resumoProfissional: data.resumoProfissional,
        experienciasOtimizadas: data.experienciasOtimizadas,
        competenciasOrdenadas: data.competenciasOrdenadas,
        cartaApresentacao: data.cartaApresentacao
      })
      setEcra('preview')
    } catch (err) {
      setResultado({ gerado: false, loading: false, erro: err.message, resumoProfissional: '', experienciasOtimizadas: [], competenciasOrdenadas: [], cartaApresentacao: '' })
      setEcra('passo-4')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">A Vaga Pretendida</h2>
        <p className="text-gray-500">A IA vai analisar esta vaga e personalizar o teu kit para ela.</p>
      </div>

      {resultado.erro && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>{resultado.erro}</span>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Cargo pretendido *</label>
            <input
              className={`input-field ${erros.cargo ? 'border-red-400' : ''}`}
              placeholder="Ex: Diretor Financeiro"
              value={vaga.cargo}
              onChange={e => atualizar('cargo', e.target.value)}
            />
            {erros.cargo && <p className="text-red-500 text-xs mt-1">{erros.cargo}</p>}
          </div>
          <div>
            <label className="label">Nome da empresa *</label>
            <input
              className={`input-field ${erros.empresa ? 'border-red-400' : ''}`}
              placeholder="Ex: KPMG Angola"
              value={vaga.empresa}
              onChange={e => atualizar('empresa', e.target.value)}
            />
            {erros.empresa && <p className="text-red-500 text-xs mt-1">{erros.empresa}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Setor de atividade *</label>
            <select
              className={`input-field ${erros.setor ? 'border-red-400' : ''}`}
              value={vaga.setor}
              onChange={e => atualizar('setor', e.target.value)}
            >
              <option value="">Selecionar setor...</option>
              {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {erros.setor && <p className="text-red-500 text-xs mt-1">{erros.setor}</p>}
          </div>
          <div>
            <label className="label">Referência da vaga <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input
              className="input-field"
              placeholder="Ex: REF-2024-CFO-001"
              value={vaga.referencia}
              onChange={e => atualizar('referencia', e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <label className="label mb-0">Descrição completa da vaga *</label>
            <span className="text-xs bg-blue-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">A IA analisa isto</span>
          </div>
          <textarea
            className={`input-field min-h-[160px] resize-none ${erros.descricao ? 'border-red-400' : ''}`}
            placeholder="Cola aqui o texto completo do anúncio de emprego. Quanto mais completo, melhor o kit gerado..."
            value={vaga.descricao}
            onChange={e => atualizar('descricao', e.target.value)}
          />
          <div className="flex justify-between mt-1">
            {erros.descricao
              ? <p className="text-red-500 text-xs">{erros.descricao}</p>
              : <span />}
            <p className="text-xs text-gray-400">{vaga.descricao.length} caracteres</p>
          </div>
        </div>

        <div>
          <label className="label">Requisitos específicos <span className="text-gray-400 font-normal">(opcional — se já estiver na descrição, não é necessário)</span></label>
          <textarea
            className="input-field min-h-[80px] resize-none"
            placeholder="Ex: Mínimo 5 anos de experiência, inglês fluente, MBA..."
            value={vaga.requisitos}
            onChange={e => atualizar('requisitos', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Tom da carta de apresentação *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {TONS_CARTA.map(tom => (
              <label
                key={tom.valor}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${vaga.tom === tom.valor ? 'border-transparent shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
                style={vaga.tom === tom.valor ? { borderColor: cor, background: `${cor}08` } : {}}
              >
                <input
                  type="radio"
                  name="tom"
                  value={tom.valor}
                  checked={vaga.tom === tom.valor}
                  onChange={() => atualizar('tom', tom.valor)}
                  className="hidden"
                />
                <div
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                  style={vaga.tom === tom.valor ? { borderColor: cor } : { borderColor: '#d1d5db' }}
                >
                  {vaga.tom === tom.valor && (
                    <div className="w-2 h-2 rounded-full" style={{ background: cor }} />
                  )}
                </div>
                <span className={`text-sm font-medium ${vaga.tom === tom.valor ? 'text-gray-900' : 'text-gray-600'}`}>
                  {tom.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* CTA de geração */}
      <div className="mt-10 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white text-center">
        <div className="text-3xl mb-2">✨</div>
        <h3 className="text-lg font-bold mb-1">O teu kit está pronto para ser gerado</h3>
        <p className="text-gray-400 text-sm mb-5">A IA vai criar o teu CV otimizado e a Carta de Apresentação personalizada para <strong className="text-white">{vaga.empresa || 'esta empresa'}</strong>.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => setEcra('passo-3')} className="btn-secondary text-sm">
            ← Voltar
          </button>
          <button
            onClick={gerar}
            className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-lg flex items-center justify-center gap-2"
            style={{ background: cor }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Gerar Kit de Emprego
          </button>
        </div>
      </div>
    </div>
  )
}
