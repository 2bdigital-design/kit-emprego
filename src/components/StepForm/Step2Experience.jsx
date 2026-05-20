import { useState } from 'react'
import { useKitStore } from '../../store/kitStore'

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const ANOS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

function MonthYearPicker({ value, onChange, placeholder }) {
  const [mes, ano] = (value || '').split('/')
  return (
    <div className="flex gap-2">
      <select
        className="input-field text-sm flex-1"
        value={mes || ''}
        onChange={e => onChange(`${e.target.value}/${ano || ''}`)}
      >
        <option value="">Mês</option>
        {MESES.map((m, i) => <option key={m} value={String(i+1).padStart(2,'0')}>{m}</option>)}
      </select>
      <select
        className="input-field text-sm flex-1"
        value={ano || ''}
        onChange={e => onChange(`${mes || ''}/${e.target.value}`)}
      >
        <option value="">Ano</option>
        {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
  )
}

export default function Step2Experience() {
  const { experiencias, adicionarExperiencia, removerExperiencia, atualizarExperiencia, setEcra, modelo } = useKitStore()
  const [erros, setErros] = useState({})
  const cor = modelo?.corPrimaria || '#2563eb'

  function validar() {
    const novosErros = {}
    const primeira = experiencias[0]
    if (!primeira.cargo.trim()) novosErros.cargo0 = 'O cargo é obrigatório.'
    if (!primeira.empresa.trim()) novosErros.empresa0 = 'A empresa é obrigatória.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function avancar() {
    if (validar()) setEcra('passo-3')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Experiência Profissional</h2>
        <p className="text-gray-500">Descreve o teu percurso. Quanto mais detalhas as conquistas, mais poderoso fica o teu kit.</p>
      </div>

      <div className="space-y-4">
        {experiencias.map((exp, idx) => (
          <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ background: idx === 0 ? `${cor}12` : '#f8fafc' }}
            >
              <span className="font-semibold text-gray-700 text-sm">
                {exp.cargo || `Experiência ${idx + 1}`}
              </span>
              {experiencias.length > 1 && (
                <button
                  onClick={() => removerExperiencia(exp.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Cargo *</label>
                  <input
                    className={`input-field ${erros[`cargo${idx}`] ? 'border-red-400' : ''}`}
                    placeholder="Ex: Responsável de Marketing"
                    value={exp.cargo}
                    onChange={e => atualizarExperiencia(exp.id, 'cargo', e.target.value)}
                  />
                  {erros[`cargo${idx}`] && <p className="text-red-500 text-xs mt-1">{erros[`cargo${idx}`]}</p>}
                </div>
                <div>
                  <label className="label">Empresa *</label>
                  <input
                    className={`input-field ${erros[`empresa${idx}`] ? 'border-red-400' : ''}`}
                    placeholder="Ex: Unitel, BAI, Sonangol"
                    value={exp.empresa}
                    onChange={e => atualizarExperiencia(exp.id, 'empresa', e.target.value)}
                  />
                  {erros[`empresa${idx}`] && <p className="text-red-500 text-xs mt-1">{erros[`empresa${idx}`]}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Data de início</label>
                  <MonthYearPicker value={exp.inicio} onChange={v => atualizarExperiencia(exp.id, 'inicio', v)} />
                </div>
                <div>
                  <label className="label">Data de fim</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`atual-${exp.id}`}
                        checked={exp.atual}
                        onChange={e => atualizarExperiencia(exp.id, 'atual', e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: cor }}
                      />
                      <label htmlFor={`atual-${exp.id}`} className="text-sm text-gray-600">Função atual</label>
                    </div>
                    {!exp.atual && (
                      <MonthYearPicker value={exp.fim} onChange={v => atualizarExperiencia(exp.id, 'fim', v)} />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="label">Responsabilidades e descrição do cargo</label>
                <textarea
                  className="input-field min-h-[90px] resize-none"
                  placeholder="Descreve as tuas principais funções e responsabilidades neste cargo..."
                  value={exp.descricao}
                  onChange={e => atualizarExperiencia(exp.id, 'descricao', e.target.value)}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 text-right mt-1">{exp.descricao.length}/500</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="label mb-0">Conquistas principais</label>
                  <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">⚡ Impacto no kit</span>
                </div>
                <textarea
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Ex: Aumentei as vendas em 30% em 6 meses. Geri uma equipa de 8 pessoas. Reduzi os custos operacionais em 15%..."
                  value={exp.conquistas}
                  onChange={e => atualizarExperiencia(exp.id, 'conquistas', e.target.value)}
                  maxLength={400}
                />
                <p className="text-xs text-gray-400 text-right mt-1">{exp.conquistas.length}/400</p>
              </div>
            </div>
          </div>
        ))}

        {experiencias.length < 5 && (
          <button
            onClick={adicionarExperiencia}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar outra experiência
          </button>
        )}
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={() => setEcra('passo-1')} className="btn-secondary">
          ← Voltar
        </button>
        <button onClick={avancar} className="btn-primary" style={{ background: cor }}>
          Continuar →
        </button>
      </div>
    </div>
  )
}
