// Layout C — Linha Minimalista (modelos 5, 8)
import { forwardRef } from 'react'

export const CvLayoutC = forwardRef(function CvLayoutC({ modelo, pessoal, resultado, formacao, competencias }, ref) {
  const { corPrimaria, corSecundaria, fonteTitulo, fonteCorpo } = modelo

  return (
    <div
      ref={ref}
      className="documento-a4 overflow-hidden"
      style={{ fontFamily: fonteCorpo, fontSize: '11px', lineHeight: 1.55, padding: '40px 44px' }}
    >
      {/* Cabeçalho minimalista */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontFamily: fonteTitulo, fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '2px', letterSpacing: '-0.5px' }}>
              {pessoal.nome || 'Nome Completo'}
            </h1>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>{pessoal.titulo}</p>
          </div>
          {pessoal.foto && (
            <img src={pessoal.foto} alt="Foto" style={{ width: '72px', height: '72px', borderRadius: '4px', objectFit: 'cover' }} />
          )}
        </div>
        <div style={{ height: '2px', background: corPrimaria, margin: '10px 0' }} />
        <p style={{ color: '#6b7280', fontSize: '10px' }}>
          {[pessoal.email, pessoal.telefone, pessoal.localizacao, pessoal.linkedin].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* Resumo */}
      {resultado.resumoProfissional && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontFamily: fonteTitulo, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: corPrimaria, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Sobre Mim
            <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </h2>
          <p style={{ color: '#4b5563', lineHeight: 1.65, fontSize: '10.5px' }}>{resultado.resumoProfissional}</p>
        </div>
      )}

      {/* Experiência */}
      {resultado.experienciasOtimizadas?.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontFamily: fonteTitulo, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: corPrimaria, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Experiência
            <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </h2>
          {resultado.experienciasOtimizadas.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <p style={{ fontWeight: 700, color: '#111827', fontSize: '11px' }}>
                  {exp.cargo} · <span style={{ fontWeight: 400, color: '#374151' }}>{exp.empresa}</span>
                </p>
                <p style={{ color: '#9ca3af', fontSize: '10px', flexShrink: 0, marginLeft: '12px' }}>{exp.periodo}</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '4px' }}>
                {exp.bullets?.map((b, j) => (
                  <li key={j} style={{ display: 'flex', gap: '6px', marginBottom: '2px', color: '#4b5563', fontSize: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: corSecundaria || '#9ca3af', fontWeight: 900, flexShrink: 0, marginTop: '1px' }}>–</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Formação */}
      {formacao.academica?.filter(f => f.curso).length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontFamily: fonteTitulo, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: corPrimaria, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Formação
            <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </h2>
          {formacao.academica.filter(f => f.curso).map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <p style={{ color: '#374151', fontSize: '10.5px' }}>
                <strong>{f.grau}</strong> em {f.curso} — {f.instituicao}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '10px', flexShrink: 0 }}>{f.ano}</p>
            </div>
          ))}
        </div>
      )}

      {/* Competências e Idiomas em linha */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {resultado.competenciasOrdenadas?.length > 0 && (
          <div style={{ flex: 2 }}>
            <h2 style={{ fontFamily: fonteTitulo, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: corPrimaria, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Competências
              <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </h2>
            <p style={{ color: '#4b5563', fontSize: '10px', lineHeight: 1.8 }}>
              {resultado.competenciasOrdenadas.join(' · ')}
            </p>
          </div>
        )}
        {formacao.idiomas?.filter(i => i.lingua).length > 0 && (
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: fonteTitulo, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: corPrimaria, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Idiomas
              <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </h2>
            {formacao.idiomas.filter(i => i.lingua).map((i, idx) => (
              <p key={idx} style={{ color: '#4b5563', fontSize: '10px', lineHeight: 1.8 }}>
                {i.lingua} <span style={{ color: '#9ca3af' }}>({i.nivel})</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export const CartaLayoutC = forwardRef(function CartaLayoutC({ modelo, pessoal, vaga, resultado }, ref) {
  const { corPrimaria, corSecundaria, fonteTitulo, fonteCorpo } = modelo
  const hoje = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div
      ref={ref}
      className="documento-a4 overflow-hidden"
      style={{ fontFamily: fonteCorpo, fontSize: '11px', lineHeight: 1.6, padding: '40px 44px' }}
    >
      {/* Cabeçalho */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: fonteTitulo, fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '2px', letterSpacing: '-0.5px' }}>
          {pessoal.nome}
        </h1>
        <div style={{ height: '2px', background: corPrimaria, margin: '8px 0' }} />
        <p style={{ color: '#6b7280', fontSize: '10px' }}>
          {[pessoal.email, pessoal.telefone, pessoal.localizacao].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* Info da carta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid #f1f5f9` }}>
        <div>
          <p style={{ fontWeight: 700, color: '#374151', fontSize: '11px' }}>Assunto: Candidatura — {vaga.cargo}</p>
          {vaga.referencia && <p style={{ color: '#6b7280', fontSize: '10px' }}>Ref: {vaga.referencia}</p>}
        </div>
        <p style={{ color: '#9ca3af', fontSize: '10px' }}>{hoje}</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: '#374151', fontWeight: 500, fontSize: '11px' }}>Exmo(a). Sr(a). Responsável de Recrutamento,</p>
        <p style={{ color: '#6b7280', fontSize: '10px' }}>{vaga.empresa}</p>
      </div>

      <div style={{ color: '#374151', lineHeight: 1.75, fontSize: '10.5px' }}>
        {resultado.cartaApresentacao?.split('\n').filter(p => p.trim()).map((paragrafo, i) => (
          <p key={i} style={{ marginBottom: '14px' }}>{paragrafo}</p>
        ))}
      </div>

      <div style={{ marginTop: '28px' }}>
        <p style={{ color: '#374151', marginBottom: '16px', fontSize: '10.5px' }}>Com os melhores cumprimentos,</p>
        <p style={{ fontFamily: fonteTitulo, fontSize: '16px', fontWeight: 700, color: corPrimaria }}>{pessoal.nome}</p>
        {pessoal.titulo && <p style={{ color: '#6b7280', fontSize: '10px', marginTop: '2px' }}>{pessoal.titulo}</p>}
      </div>
    </div>
  )
})
