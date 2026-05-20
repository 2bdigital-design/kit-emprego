// Layout B — Cabeçalho Completo (modelos 2, 4, 7, 10)
import { forwardRef } from 'react'

export const CvLayoutB = forwardRef(function CvLayoutB({ modelo, pessoal, resultado, experiencias, formacao, competencias }, ref) {
  const { corPrimaria, corSecundaria, fonteTitulo, fonteCorpo } = modelo

  return (
    <div
      ref={ref}
      className="documento-a4 overflow-hidden"
      style={{ fontFamily: fonteCorpo, fontSize: '11px', lineHeight: 1.5 }}
    >
      {/* Cabeçalho */}
      <div style={{ background: corPrimaria, padding: '28px 36px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {pessoal.foto && (
              <img src={pessoal.foto} alt="Foto" style={{ width: '72px', height: '72px', borderRadius: '8px', objectFit: 'cover', border: `2px solid ${corSecundaria}` }} />
            )}
            <div>
              <h1 style={{ fontFamily: fonteTitulo, fontSize: '24px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.2 }}>
                {pessoal.nome || 'Nome Completo'}
              </h1>
              <p style={{ fontSize: '13px', opacity: 0.85 }}>{pessoal.titulo || 'Título Profissional'}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '10px', opacity: 0.85, lineHeight: 1.8 }}>
            {pessoal.email && <p>{pessoal.email}</p>}
            {pessoal.telefone && <p>{pessoal.telefone}</p>}
            {pessoal.localizacao && <p>{pessoal.localizacao}</p>}
            {pessoal.linkedin && <p style={{ opacity: 0.75 }}>{pessoal.linkedin}</p>}
          </div>
        </div>
      </div>

      {/* Resumo */}
      {resultado.resumoProfissional && (
        <div style={{ padding: '16px 36px', background: `${corSecundaria}18`, borderBottom: `1px solid ${corSecundaria}44` }}>
          <p style={{ color: '#374151', lineHeight: 1.65, fontSize: '10.5px' }}>{resultado.resumoProfissional}</p>
        </div>
      )}

      {/* Corpo em duas colunas */}
      <div style={{ display: 'flex', gap: '0', padding: '0' }}>
        {/* Coluna principal — Experiência */}
        <div style={{ flex: 2, padding: '24px 28px 24px 36px', borderRight: `1px solid #f1f5f9` }}>
          {resultado.experienciasOtimizadas?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontFamily: fonteTitulo, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: corPrimaria, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'block', width: '18px', height: '2px', background: corSecundaria }} />
                Experiência Profissional
              </h2>
              {resultado.experienciasOtimizadas.map((exp, i) => (
                <div key={i} style={{ marginBottom: '16px', paddingLeft: '12px', borderLeft: `2px solid ${i === 0 ? corSecundaria : '#e2e8f0'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <p style={{ fontWeight: 700, color: '#1f2937', fontSize: '11px' }}>{exp.cargo}</p>
                    <p style={{ color: '#9ca3af', fontSize: '9.5px', flexShrink: 0, marginLeft: '8px' }}>{exp.periodo}</p>
                  </div>
                  <p style={{ color: corSecundaria, fontWeight: 600, fontSize: '10px', marginBottom: '4px' }}>{exp.empresa}</p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {exp.bullets?.map((b, j) => (
                      <li key={j} style={{ display: 'flex', gap: '6px', marginBottom: '2px', color: '#4b5563', fontSize: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: corSecundaria, fontWeight: 700, flexShrink: 0 }}>▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coluna lateral — Formação e Skills */}
        <div style={{ flex: 1, padding: '24px 28px 24px 24px' }}>
          {formacao.academica?.filter(f => f.curso).length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontFamily: fonteTitulo, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: corPrimaria, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'block', width: '14px', height: '2px', background: corSecundaria }} />
                Formação
              </h2>
              {formacao.academica.filter(f => f.curso).map((f, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: 700, color: '#1f2937', fontSize: '10.5px' }}>{f.grau}</p>
                  <p style={{ color: '#374151', fontSize: '10px' }}>{f.curso}</p>
                  <p style={{ color: '#9ca3af', fontSize: '9.5px' }}>{f.instituicao}</p>
                  <p style={{ color: corPrimaria, fontSize: '9.5px' }}>{f.ano}</p>
                </div>
              ))}
            </div>
          )}

          {resultado.competenciasOrdenadas?.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontFamily: fonteTitulo, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: corPrimaria, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'block', width: '14px', height: '2px', background: corSecundaria }} />
                Competências
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {resultado.competenciasOrdenadas.map((s, i) => (
                  <span key={i} style={{ background: `${corPrimaria}14`, color: corPrimaria, padding: '2px 8px', borderRadius: '4px', fontSize: '9.5px', fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {formacao.idiomas?.filter(i => i.lingua).length > 0 && (
            <div>
              <h2 style={{ fontFamily: fonteTitulo, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', color: corPrimaria, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'block', width: '14px', height: '2px', background: corSecundaria }} />
                Idiomas
              </h2>
              {formacao.idiomas.filter(i => i.lingua).map((i, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
                  <span style={{ color: '#374151' }}>{i.lingua}</span>
                  <span style={{ color: '#9ca3af', fontSize: '9.5px' }}>{i.nivel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export const CartaLayoutB = forwardRef(function CartaLayoutB({ modelo, pessoal, vaga, resultado }, ref) {
  const { corPrimaria, corSecundaria, fonteTitulo, fonteCorpo } = modelo
  const hoje = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div
      ref={ref}
      className="documento-a4 overflow-hidden"
      style={{ fontFamily: fonteCorpo, fontSize: '11px', lineHeight: 1.6 }}
    >
      {/* Mesmo cabeçalho do CV */}
      <div style={{ background: corPrimaria, padding: '24px 36px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {pessoal.foto && <img src={pessoal.foto} alt="Foto" style={{ width: '56px', height: '56px', borderRadius: '6px', objectFit: 'cover', border: `2px solid ${corSecundaria}` }} />}
            <div>
              <h1 style={{ fontFamily: fonteTitulo, fontSize: '20px', fontWeight: 700, marginBottom: '2px' }}>{pessoal.nome}</h1>
              <p style={{ fontSize: '11px', opacity: 0.8 }}>Carta de Apresentação</p>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '9.5px', opacity: 0.85, lineHeight: 1.8 }}>
            {pessoal.email && <p>{pessoal.email}</p>}
            {pessoal.telefone && <p>{pessoal.telefone}</p>}
          </div>
        </div>
      </div>

      {/* Corpo */}
      <div style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid #e2e8f0` }}>
          <div>
            <p style={{ fontWeight: 600, color: '#1f2937', fontSize: '11px' }}>Para: {vaga.empresa}</p>
            <p style={{ color: '#6b7280', fontSize: '10px' }}>Candidatura — {vaga.cargo}</p>
            {vaga.referencia && <p style={{ color: '#6b7280', fontSize: '10px' }}>Ref: {vaga.referencia}</p>}
          </div>
          <p style={{ color: '#9ca3af', fontSize: '10px' }}>{pessoal.localizacao}, {hoje}</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#374151', fontWeight: 600, fontSize: '11px' }}>Exmo(a). Sr(a). Responsável de Recrutamento,</p>
        </div>

        <div style={{ color: '#374151', lineHeight: 1.75, fontSize: '10.5px' }}>
          {resultado.cartaApresentacao?.split('\n').filter(p => p.trim()).map((paragrafo, i) => (
            <p key={i} style={{ marginBottom: '14px' }}>{paragrafo}</p>
          ))}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid #e2e8f0` }}>
          <p style={{ color: '#374151', marginBottom: '4px', fontSize: '10.5px' }}>Atenciosamente,</p>
          <p style={{ fontFamily: fonteTitulo, fontSize: '14px', fontWeight: 700, color: corPrimaria }}>{pessoal.nome}</p>
          <p style={{ color: '#6b7280', fontSize: '10px' }}>{pessoal.email} · {pessoal.telefone}</p>
        </div>
      </div>
    </div>
  )
})
