import { useState, useRef } from 'react'
import { useKitStore } from '../../store/kitStore'
import AIChat from '../AIChat'

function BadgeSkill({ texto, cor }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
      style={{ background: cor }}>
      {texto}
    </span>
  )
}

function SecaoTitulo({ icone, label, cor }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0"
        style={{ background: cor }}>
        {icone}
      </div>
      <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{label}</h3>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )
}

export default function NormalPreview() {
  const { modelo, pessoal, resultado, formacao, competencias, vaga, auth, setEcra, reiniciarKit } = useKitStore()
  const [abaAtiva, setAbaAtiva] = useState('cv')
  const [mostrarChat, setMostrarChat] = useState(false)
  const cor = modelo?.corPrimaria || '#2563eb'
  const corSec = modelo?.corSecundaria || '#93c5fd'
  const acessoPago = auth?.user?.acessoPago

  const paragrafosCart = resultado.cartaApresentacao?.split('\n').filter(p => p.trim()) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
            {['cv', 'carta'].map(aba => (
              <button key={aba}
                onClick={() => setAbaAtiva(aba)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${abaAtiva === aba ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                {aba === 'cv' ? '📄 CV' : '✉ Carta'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <button onClick={() => setEcra('passo-4')} className="btn-ghost text-sm whitespace-nowrap hidden sm:flex">
              ← Editar
            </button>
            <button onClick={() => setMostrarChat(true)} className="btn-secondary text-sm whitespace-nowrap">
              ✏️ Ajustar
            </button>
            {acessoPago ? (
              <button
                onClick={() => setEcra('exportar')}
                className="btn-primary text-sm whitespace-nowrap flex items-center gap-1"
                style={{ background: cor }}
              >
                ⬇️ Exportar
              </button>
            ) : (
              <button
                onClick={() => setEcra('pagamento')}
                className="btn-primary text-sm whitespace-nowrap flex items-center gap-1"
                style={{ background: cor }}
              >
                💾 Guardar Kit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {abaAtiva === 'cv' ? (
          <div className="space-y-4">
            {/* Hero card */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="h-20 relative" style={{ background: `linear-gradient(135deg, ${cor}, ${corSec})` }} />
              <div className="bg-white px-6 pb-5">
                <div className="flex items-end gap-4 -mt-10 mb-4">
                  {pessoal.foto ? (
                    <img src={pessoal.foto} alt="Foto" className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
                      style={{ background: cor }}>
                      {pessoal.nome?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="pb-1">
                    <h1 className="text-xl font-bold text-gray-900">{pessoal.nome || 'Nome Completo'}</h1>
                    <p className="text-sm font-medium" style={{ color: cor }}>{pessoal.titulo}</p>
                  </div>
                </div>

                {/* Contactos */}
                <div className="flex flex-wrap gap-2">
                  {pessoal.email && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      ✉️ {pessoal.email}
                    </span>
                  )}
                  {pessoal.telefone && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      📞 {pessoal.telefone}
                    </span>
                  )}
                  {pessoal.localizacao && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      📍 {pessoal.localizacao}
                    </span>
                  )}
                  {pessoal.linkedin && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                      🔗 LinkedIn
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Resumo */}
            {resultado.resumoProfissional && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <SecaoTitulo icone="💡" label="Resumo Profissional" cor={cor} />
                <p className="text-gray-700 text-sm leading-relaxed">{resultado.resumoProfissional}</p>
              </div>
            )}

            {/* Experiência */}
            {resultado.experienciasOtimizadas?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <SecaoTitulo icone="💼" label="Experiência Profissional" cor={cor} />
                <div className="space-y-5">
                  {resultado.experienciasOtimizadas.map((exp, i) => (
                    <div key={i} className="relative pl-5">
                      <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ background: i === 0 ? cor : '#cbd5e1' }} />
                      {i < resultado.experienciasOtimizadas.length - 1 && (
                        <div className="absolute left-1 top-3 bottom-0 w-px bg-gray-100" />
                      )}
                      <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{exp.cargo}</p>
                          <p className="text-sm font-medium" style={{ color: cor }}>{exp.empresa}</p>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full flex-shrink-0">{exp.periodo}</span>
                      </div>
                      <ul className="space-y-1 mt-2">
                        {exp.bullets?.map((b, j) => (
                          <li key={j} className="flex gap-2 text-sm text-gray-600">
                            <span className="flex-shrink-0 font-bold mt-0.5" style={{ color: cor }}>▸</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid: Formação + Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Formação */}
              {formacao.academica?.filter(f => f.curso).length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <SecaoTitulo icone="🎓" label="Formação" cor={cor} />
                  <div className="space-y-3">
                    {formacao.academica.filter(f => f.curso).map((f, i) => (
                      <div key={i}>
                        <p className="font-semibold text-gray-900 text-sm">{f.grau} em {f.curso}</p>
                        <p className="text-xs text-gray-500">{f.instituicao}</p>
                        <p className="text-xs font-medium mt-0.5" style={{ color: cor }}>{f.ano}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Idiomas */}
              {formacao.idiomas?.filter(i => i.lingua).length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <SecaoTitulo icone="🌍" label="Idiomas" cor={cor} />
                  <div className="space-y-2">
                    {formacao.idiomas.filter(i => i.lingua).map((i, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 font-medium">{i.lingua}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: cor }}>{i.nivel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Competências */}
            {resultado.competenciasOrdenadas?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <SecaoTitulo icone="⚙️" label="Competências" cor={cor} />
                <div className="flex flex-wrap gap-2">
                  {resultado.competenciasOrdenadas.map((s, i) => (
                    <BadgeSkill key={i} texto={s} cor={i === 0 ? cor : `${cor}cc`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─── Carta ─────────────────────────────────────────────── */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Cabeçalho da carta */}
            <div className="p-5 border-b border-gray-50" style={{ background: `${cor}08` }}>
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h2 className="font-bold text-gray-900">{pessoal.nome}</h2>
                  <p className="text-sm" style={{ color: cor }}>{pessoal.titulo}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {[pessoal.email, pessoal.telefone].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{pessoal.localizacao}</p>
                  <p>{new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 pb-4 border-b border-gray-50">
                <p className="font-semibold text-gray-800 text-sm">Exmo(a). Sr(a). Responsável de Recrutamento,</p>
                <p className="text-xs text-gray-500">{vaga.empresa}</p>
                {vaga.referencia && <p className="text-xs text-gray-400 mt-1">Ref: {vaga.referencia}</p>}
              </div>

              <div className="space-y-4">
                {paragrafosCart.map((p, i) => (
                  <p key={i} className="text-sm text-gray-700 leading-relaxed">{p}</p>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-50">
                <p className="text-sm text-gray-600 mb-3">Com os melhores cumprimentos,</p>
                <p className="font-bold text-gray-900" style={{ fontFamily: modelo?.fonteTitulo }}>{pessoal.nome}</p>
                <p className="text-sm" style={{ color: cor }}>{pessoal.titulo}</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA de pagamento (para utilizadores não pagos) */}
        {!acessoPago && (
          <div className="mt-6 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${cor}, ${cor}cc)` }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">🔒</div>
                <div>
                  <h3 className="font-bold mb-1">Gostaste do resultado?</h3>
                  <p className="text-sm opacity-90 mb-3">Guarda o teu kit para receber a versão para imprimir em PDF e aceder a todos os temas de design.</p>
                  <button
                    onClick={() => setEcra('pagamento')}
                    className="bg-white text-sm font-bold px-5 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95"
                    style={{ color: cor }}
                  >
                    💾 Guardar Kit — Ver preço
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {mostrarChat && <AIChat onClose={() => setMostrarChat(false)} />}
    </div>
  )
}
