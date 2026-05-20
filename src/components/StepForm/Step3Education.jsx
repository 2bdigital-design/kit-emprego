import { useState } from 'react'
import { useKitStore } from '../../store/kitStore'
import { GRAUS, NIVEIS_IDIOMA, SOFT_SKILLS_SUGERIDAS } from '../../config/models'

export default function Step3Education() {
  const { formacao, setFormacao, competencias, setCompetencias, setEcra, modelo } = useKitStore()
  const [tagInput, setTagInput] = useState('')
  const [aviso, setAviso] = useState('')
  const cor = modelo?.corPrimaria || '#2563eb'

  // Académica
  function atualizarAcademica(id, campo, valor) {
    setFormacao({
      ...formacao,
      academica: formacao.academica.map(f => f.id === id ? { ...f, [campo]: valor } : f)
    })
  }
  function adicionarAcademica() {
    if (formacao.academica.length >= 3) return
    setFormacao({
      ...formacao,
      academica: [...formacao.academica, { id: Date.now(), grau: 'Licenciatura', curso: '', instituicao: '', ano: '', distincao: '' }]
    })
  }
  function removerAcademica(id) {
    if (formacao.academica.length <= 1) return
    setFormacao({ ...formacao, academica: formacao.academica.filter(f => f.id !== id) })
  }

  // Certificados
  function atualizarCertificado(id, campo, valor) {
    setFormacao({ ...formacao, certificados: formacao.certificados.map(c => c.id === id ? { ...c, [campo]: valor } : c) })
  }
  function adicionarCertificado() {
    if (formacao.certificados.length >= 5) return
    setFormacao({ ...formacao, certificados: [...formacao.certificados, { id: Date.now(), nome: '', inst: '', ano: '' }] })
  }
  function removerCertificado(id) {
    if (formacao.certificados.length <= 1) return
    setFormacao({ ...formacao, certificados: formacao.certificados.filter(c => c.id !== id) })
  }

  // Idiomas
  function atualizarIdioma(id, campo, valor) {
    setFormacao({ ...formacao, idiomas: formacao.idiomas.map(i => i.id === id ? { ...i, [campo]: valor } : i) })
  }
  function adicionarIdioma() {
    if (formacao.idiomas.length >= 5) return
    setFormacao({ ...formacao, idiomas: [...formacao.idiomas, { id: Date.now(), lingua: '', nivel: 'B2' }] })
  }
  function removerIdioma(id) {
    if (formacao.idiomas.length <= 1) return
    setFormacao({ ...formacao, idiomas: formacao.idiomas.filter(i => i.id !== id) })
  }

  // Tags técnicas
  function adicionarTag(e) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      if (competencias.tecnicas.length >= 15) return
      const nova = tagInput.trim().replace(/,$/, '')
      if (!competencias.tecnicas.includes(nova)) {
        setCompetencias({ ...competencias, tecnicas: [...competencias.tecnicas, nova] })
      }
      setTagInput('')
    }
  }
  function removerTag(tag) {
    setCompetencias({ ...competencias, tecnicas: competencias.tecnicas.filter(t => t !== tag) })
  }

  // Soft skills
  function toggleSoft(skill) {
    const atual = competencias.soft
    if (atual.includes(skill)) {
      setCompetencias({ ...competencias, soft: atual.filter(s => s !== skill) })
    } else {
      setCompetencias({ ...competencias, soft: [...atual, skill] })
    }
  }

  function avancar() {
    if (!formacao.academica[0]?.curso.trim()) {
      setAviso('Recomendamos adicionar pelo menos uma formação académica.')
    }
    setEcra('passo-4')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Formação & Competências</h2>
        <p className="text-gray-500">As tuas qualificações e habilidades relevantes para a vaga.</p>
      </div>

      <div className="space-y-6">
        {/* Formação académica */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span style={{ color: cor }}>🎓</span> Formação Académica
          </h3>
          <div className="space-y-4">
            {formacao.academica.map((f, idx) => (
              <div key={f.id} className="space-y-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium">Formação {idx + 1}</span>
                  {formacao.academica.length > 1 && (
                    <button onClick={() => removerAcademica(f.id)} className="text-gray-400 hover:text-red-500 text-xs">Remover</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Grau</label>
                    <select className="input-field" value={f.grau} onChange={e => atualizarAcademica(f.id, 'grau', e.target.value)}>
                      {GRAUS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Ano de conclusão</label>
                    <input className="input-field" placeholder="Ex: 2019" value={f.ano} onChange={e => atualizarAcademica(f.id, 'ano', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Curso</label>
                  <input className="input-field" placeholder="Ex: Gestão de Empresas" value={f.curso} onChange={e => atualizarAcademica(f.id, 'curso', e.target.value)} />
                </div>
                <div>
                  <label className="label">Instituição</label>
                  <input className="input-field" placeholder="Ex: Universidade Agostinho Neto" value={f.instituicao} onChange={e => atualizarAcademica(f.id, 'instituicao', e.target.value)} />
                </div>
                <div>
                  <label className="label">Distinção / Nota <span className="text-gray-400 font-normal">(opcional)</span></label>
                  <input className="input-field" placeholder="Ex: Aprovado com distinção" value={f.distincao} onChange={e => atualizarAcademica(f.id, 'distincao', e.target.value)} />
                </div>
              </div>
            ))}
            {formacao.academica.length < 3 && (
              <button onClick={adicionarAcademica} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                + Adicionar formação
              </button>
            )}
          </div>
        </div>

        {/* Certificados */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span style={{ color: cor }}>📜</span> Formações Complementares
          </h3>
          <div className="space-y-3">
            {formacao.certificados.map((c, idx) => (
              <div key={c.id} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input className="input-field text-sm" placeholder="Nome da formação" value={c.nome} onChange={e => atualizarCertificado(c.id, 'nome', e.target.value)} />
                  </div>
                  <input className="input-field text-sm" placeholder="Instituição" value={c.inst} onChange={e => atualizarCertificado(c.id, 'inst', e.target.value)} />
                  <input className="input-field text-sm" placeholder="Ano" value={c.ano} onChange={e => atualizarCertificado(c.id, 'ano', e.target.value)} />
                </div>
                {formacao.certificados.length > 1 && (
                  <button onClick={() => removerCertificado(c.id)} className="text-gray-300 hover:text-red-400 mt-3">✕</button>
                )}
              </div>
            ))}
            {formacao.certificados.length < 5 && (
              <button onClick={adicionarCertificado} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                + Adicionar certificado
              </button>
            )}
          </div>
        </div>

        {/* Idiomas */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span style={{ color: cor }}>🌍</span> Idiomas
          </h3>
          <div className="space-y-2">
            {formacao.idiomas.map((i) => (
              <div key={i.id} className="flex gap-2 items-center">
                <input className="input-field text-sm flex-1" placeholder="Ex: Inglês, Francês" value={i.lingua} onChange={e => atualizarIdioma(i.id, 'lingua', e.target.value)} />
                <select className="input-field text-sm w-32" value={i.nivel} onChange={e => atualizarIdioma(i.id, 'nivel', e.target.value)}>
                  {NIVEIS_IDIOMA.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                {formacao.idiomas.length > 1 && (
                  <button onClick={() => removerIdioma(i.id)} className="text-gray-300 hover:text-red-400">✕</button>
                )}
              </div>
            ))}
            {formacao.idiomas.length < 5 && (
              <button onClick={adicionarIdioma} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                + Adicionar idioma
              </button>
            )}
          </div>
        </div>

        {/* Skills técnicas */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
            <span style={{ color: cor }}>⚙️</span> Competências Técnicas
          </h3>
          <p className="text-xs text-gray-400 mb-3">Escreve e prime Enter para adicionar (máx. 15)</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {competencias.tecnicas.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ background: cor }}>
                {tag}
                <button onClick={() => removerTag(tag)} className="hover:opacity-70 ml-1">✕</button>
              </span>
            ))}
          </div>
          {competencias.tecnicas.length < 15 && (
            <input
              className="input-field"
              placeholder="Ex: Excel, Power BI, SAP... (Enter para adicionar)"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={adicionarTag}
            />
          )}
        </div>

        {/* Soft skills */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span style={{ color: cor }}>🧠</span> Competências Transversais
          </h3>
          <div className="flex flex-wrap gap-2">
            {SOFT_SKILLS_SUGERIDAS.map(skill => {
              const selecionado = competencias.soft.includes(skill)
              return (
                <button
                  key={skill}
                  onClick={() => toggleSoft(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                    ${selecionado ? 'text-white border-transparent' : 'text-gray-600 border-gray-200 bg-white hover:border-gray-300'}`}
                  style={selecionado ? { background: cor, borderColor: cor } : {}}
                >
                  {selecionado ? '✓ ' : ''}{skill}
                </button>
              )
            })}
          </div>
        </div>

        {aviso && <p className="text-amber-600 text-sm bg-amber-50 px-4 py-3 rounded-xl">{aviso}</p>}
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={() => setEcra('passo-2')} className="btn-secondary">← Voltar</button>
        <button onClick={avancar} className="btn-primary" style={{ background: cor }}>Continuar →</button>
      </div>
    </div>
  )
}
