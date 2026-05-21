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

  function validar(exigirDescricao = true) {
    const novosErros = {}
    if (!vaga.cargo.trim()) novosErros.cargo = 'O cargo pretendido é obrigatório.'
    if (!vaga.empresa.trim()) novosErros.empresa = 'O nome da empresa é obrigatório.'
    if (!vaga.setor.trim()) novosErros.setor = 'O setor de atividade é obrigatório.'
    if (exigirDescricao && (!vaga.descricao.trim() || vaga.descricao.length < 50))
      novosErros.descricao = 'Cola a descrição completa da vaga (mínimo 50 caracteres).'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  // ── Geração SEM IA ──────────────────────────────────────────────────────
  function gerarSemIA() {
    if (!validar(false)) return

    const expsValidas = experiencias.filter(e => e.cargo && e.empresa)
    const primeiraExp = expsValidas[0]
    const ultimaFormacao = formacao.academica.filter(f => f.curso)[0]
    const tecnicos = competencias.tecnicas.filter(Boolean)
    const soft = competencias.soft.filter(Boolean)
    const idiomas = formacao.idiomas.filter(i => i.lingua).map(i => `${i.lingua} (${i.nivel})`).join(', ')

    // Resumo profissional
    const partes = [`${pessoal.nome || 'O candidato'} é um profissional dedicado`]
    if (primeiraExp) partes.push(` com experiência como ${primeiraExp.cargo} na área de ${vaga.setor}`)
    if (ultimaFormacao) partes.push(`. Formado em ${ultimaFormacao.curso} pela ${ultimaFormacao.instituicao}`)
    if (tecnicos.length) partes.push(`, com competências em ${tecnicos.slice(0, 3).join(', ')}`)
    partes.push(`. Candidata-se ao cargo de ${vaga.cargo} na ${vaga.empresa}.`)
    const resumoProfissional = partes.join('')

    // Experiências otimizadas
    const experienciasOtimizadas = expsValidas.map(e => {
      const bullets = e.descricao
        ? e.descricao.split(/[\n.]+/).map(s => s.trim()).filter(s => s.length > 8).slice(0, 4)
        : []
      if (!bullets.length) bullets.push(`Responsável pelas funções inerentes ao cargo de ${e.cargo}.`)
      return {
        cargo: e.cargo,
        empresa: e.empresa,
        periodo: `${e.inicio || ''}${(e.inicio && (e.fim || e.atual)) ? ' – ' : ''}${e.atual ? 'Presente' : (e.fim || '')}`,
        bullets
      }
    })

    // Competências ordenadas
    const competenciasOrdenadas = [...tecnicos, ...soft].filter(Boolean)

    // Carta de apresentação
    const nomeCompleto = pessoal.nome || 'Candidato(a)'
    const carta = [
      `Exmo(a). Sr(a). Responsável de Recrutamento,`,
      ``,
      `É com grande interesse que me candidato ao cargo de ${vaga.cargo} na ${vaga.empresa}. Após analisar esta oportunidade, estou convicto(a) de que o meu perfil profissional corresponde às necessidades da vossa organização.`,
      ``,
      primeiraExp
        ? `Ao longo da minha carreira, desempenhei funções como ${primeiraExp.cargo} na ${primeiraExp.empresa}, onde adquiri experiência prática e desenvolvi competências técnicas e relacionais relevantes para esta posição.${ultimaFormacao ? ` A minha formação em ${ultimaFormacao.curso} pela ${ultimaFormacao.instituicao} complementa e fundamenta essa experiência.` : ''}`
        : `A minha formação${ultimaFormacao ? ` em ${ultimaFormacao.curso} pela ${ultimaFormacao.instituicao}` : ''} dotou-me de conhecimentos sólidos e de uma capacidade analítica que procuro aplicar continuamente no contexto profissional.`,
      ``,
      [
        tecnicos.length ? `Possuo conhecimentos em ${tecnicos.slice(0, 4).join(', ')}.` : '',
        idiomas ? `Comunico fluentemente em ${idiomas}, o que facilita a colaboração em ambientes diversos.` : '',
        soft.length ? `Entre as minhas competências transversais destaco ${soft.slice(0, 3).join(', ')}.` : ''
      ].filter(Boolean).join(' '),
      ``,
      `Estou disponível para uma entrevista a qualquer momento conveniente e aguardo com expectativa a oportunidade de apresentar pessoalmente a minha candidatura à ${vaga.empresa}.`,
      ``,
      `Com os melhores cumprimentos,`,
      nomeCompleto,
      [pessoal.email, pessoal.telefone].filter(Boolean).join(' | ')
    ].filter(l => l !== undefined).join('\n')

    setResultado({
      gerado: true,
      loading: false,
      erro: null,
      resumoProfissional,
      experienciasOtimizadas,
      competenciasOrdenadas,
      cartaApresentacao: carta
    })
    setEcra('preview')
  }

  // ── Geração COM IA ──────────────────────────────────────────────────────
  async function gerarComIA() {
    if (!validar(true)) return

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
        <p className="text-gray-500">Preenche os campos abaixo para gerar o teu CV e Carta de Apresentação.</p>
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
            <label className="label mb-0">Descrição da vaga</label>
            <span className="text-xs bg-blue-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">Necessário para usar IA</span>
          </div>
          <textarea
            className={`input-field min-h-[140px] resize-none ${erros.descricao ? 'border-red-400' : ''}`}
            placeholder="Cola aqui o texto do anúncio de emprego (obrigatório para a versão com IA — opcional para gerar sem IA)."
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
          <label className="label">Tom da carta de apresentação</label>
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

      {/* CTA */}
      <div className="mt-10 space-y-3">
        {/* Gerar SEM IA — principal (sempre disponível) */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Gerar a partir do formulário</h3>
          <p className="text-gray-500 text-sm mb-4">Cria o CV e a Carta com os dados que preencheste, sem usar IA. Rápido e sempre disponível.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setEcra('passo-3')} className="btn-secondary text-sm">
              ← Voltar
            </button>
            <button
              onClick={gerarSemIA}
              className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center gap-2 bg-gray-800"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Gerar CV + Carta
            </button>
          </div>
        </div>

        {/* Gerar COM IA — requer créditos */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl">✨</span>
            <h3 className="text-base font-bold">Melhorar com IA</h3>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Requer créditos</span>
          </div>
          <p className="text-gray-400 text-xs mb-3">A IA analisa a vaga e otimiza o CV e a carta especificamente para ela. Necessita da descrição da vaga.</p>
          <button
            onClick={gerarComIA}
            className="px-6 py-2.5 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 mx-auto text-sm"
            style={{ background: cor }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Gerar com IA
          </button>
        </div>
      </div>
    </div>
  )
}
