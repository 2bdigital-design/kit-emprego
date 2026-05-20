// Layout A — Sidebar Esquerda (modelos 1, 3, 6, 9)
import { forwardRef } from 'react'

export const CvLayoutA = forwardRef(function CvLayoutA({ modelo, pessoal, resultado, experiencias, formacao, competencias }, ref) {
  const { corPrimaria, corSecundaria, fonteTitulo, fonteCorpo } = modelo

  return (
    <div
      ref={ref}
      className="documento-a4 flex overflow-hidden"
      style={{ fontFamily: fonteCorpo, fontSize: '11px', lineHeight: 1.5 }}
    >
      {/* Sidebar */}
      <div style={{ background: corPrimaria, width: '200px', minHeight: '100%', padding: '32px 20px', color: 'white', flexShrink: 0 }}>
        {pessoal.foto && (
          <img
            src={pessoal.foto}
            alt="Foto"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: `3px solid ${corSecundaria}` }}
          />
        )}
        {!pessoal.foto && (
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `rgba(255,255,255,0.2)`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
            {pessoal.nome.charAt(0) || '?'}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '6px' }}>Contacto</p>
          {pessoal.email && <p style={{ fontSize: '9.5px', marginBottom: '4px', wordBreak: 'break-all' }}>✉ {pessoal.email}</p>}
          {pessoal.telefone && <p style={{ fontSize: '9.5px', marginBottom: '4px' }}>📞 {pessoal.telefone}</p>}
          {pessoal.localizacao && <p style={{ fontSize: '9.5px', marginBottom: '4px' }}>📍 {pessoal.localizacao}</p>}
          {pessoal.linkedin && <p style={{ fontSize: '9px', marginBottom: '4px', wordBreak: 'break-all', opacity: 0.85 }}>🔗 {pessoal.linkedin}</p>}
        </div>

        {resultado.competenciasOrdenadas?.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '8px' }}>Competências</p>
            {resultado.competenciasOrdenadas.map((s, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '3px', padding: '2px 6px', fontSize: '9px' }}>{s}</div>
              </div>
            ))}
          </div>
        )}

        {formacao.idiomas?.filter(i => i.lingua).length > 0 && (
          <div>
            <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '8px' }}>Idiomas</p>
            {formacao.idiomas.filter(i => i.lingua).map((i, idx) => (
              <div key={idx} style={{ marginBottom: '4px', fontSize: '9.5px' }}>
                <span>{i.lingua}</span>
                <span style={{ opacity: 0.65, marginLeft: '4px' }}>({i.nivel})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div style={{ flex: 1, padding: '32px 28px', overflow: 'hidden' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: fonteTitulo, fontSize: '22px', fontWeight: 700, color: corPrimaria, marginBottom: '4px', lineHeight: 1.2 }}>
            {pessoal.nome || 'Nome Completo'}
          </h1>
          <p style={{ fontSize: '12px', color: corSecundaria, fontWeight: 600, letterSpacing: '0.5px' }}>
            {pessoal.titulo || 'Título Profissional'}
          </p>
        </div>

        {resultado.resumoProfissional && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: fonteTitulo, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: corPrimaria, borderBottom: `2px solid ${corSecundaria}`, paddingBottom: '4px', marginBottom: '8px' }}>
              Resumo Profissional
            </h2>
            <p style={{ color: '#374151', lineHeight: 1.6, fontSize: '10.5px' }}>{resultado.resumoProfissional}</p>
          </div>
        )}

        {resultado.experienciasOtimizadas?.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontFamily: fonteTitulo, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: corPrimaria, borderBottom: `2px solid ${corSecundaria}`, paddingBottom: '4px', marginBottom: '10px' }}>
              Experiência Profissional
            </h2>
            {resultado.experienciasOtimizadas.map((exp, i) => (
              <div key={i} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1f2937', fontSize: '11px' }}>{exp.cargo}</p>
                    <p style={{ color: corSecundaria, fontWeight: 600, fontSize: '10px' }}>{exp.empresa}</p>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '9.5px', flexShrink: 0, marginLeft: '8px' }}>{exp.periodo}</p>
                </div>
                <ul style={{ marginTop: '4px', paddingLeft: '0', listStyle: 'none' }}>
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

        {formacao.academica?.filter(f => f.curso).length > 0 && (
          <div>
            <h2 style={{ fontFamily: fonteTitulo, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: corPrimaria, borderBottom: `2px solid ${corSecundaria}`, paddingBottom: '4px', marginBottom: '10px' }}>
              Formação Académica
            </h2>
            {formacao.academica.filter(f => f.curso).map((f, i) => (
              <div key={i} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#1f2937', fontSize: '10.5px' }}>{f.grau} em {f.curso}</p>
                  <p style={{ color: '#6b7280', fontSize: '10px' }}>{f.instituicao}</p>
                  {f.distincao && <p style={{ color: corSecundaria, fontSize: '9.5px', fontStyle: 'italic' }}>{f.distincao}</p>}
                </div>
                <p style={{ color: '#9ca3af', fontSize: '9.5px', flexShrink: 0 }}>{f.ano}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export const CartaLayoutA = forwardRef(function CartaLayoutA({ modelo, pessoal, vaga, resultado }, ref) {
  const { corPrimaria, corSecundaria, fonteTitulo, fonteCorpo } = modelo
  const hoje = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div
      ref={ref}
      className="documento-a4 flex overflow-hidden"
      style={{ fontFamily: fonteCorpo, fontSize: '11px', lineHeight: 1.6 }}
    >
      {/* Sidebar */}
      <div style={{ background: corPrimaria, width: '200px', minHeight: '100%', padding: '32px 20px', color: 'white', flexShrink: 0 }}>
        {pessoal.foto && (
          <img src={pessoal.foto} alt="Foto" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: `3px solid ${corSecundaria}` }} />
        )}
        {!pessoal.foto && (
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `rgba(255,255,255,0.2)`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
            {pessoal.nome.charAt(0) || '?'}
          </div>
        )}
        <p style={{ textAlign: 'center', fontFamily: fonteTitulo, fontSize: '10px', fontWeight: 700, marginBottom: '4px' }}>{pessoal.nome}</p>
        <p style={{ textAlign: 'center', fontSize: '8.5px', opacity: 0.8, marginBottom: '16px' }}>{pessoal.titulo}</p>
        <div style={{ fontSize: '9px' }}>
          {pessoal.email && <p style={{ marginBottom: '4px', wordBreak: 'break-all' }}>✉ {pessoal.email}</p>}
          {pessoal.telefone && <p style={{ marginBottom: '4px' }}>📞 {pessoal.telefone}</p>}
          {pessoal.localizacao && <p style={{ marginBottom: '4px' }}>📍 {pessoal.localizacao}</p>}
        </div>
      </div>

      {/* Corpo da carta */}
      <div style={{ flex: 1, padding: '36px 32px' }}>
        <h1 style={{ fontFamily: fonteTitulo, fontSize: '16px', fontWeight: 700, color: corPrimaria, marginBottom: '4px' }}>
          Carta de Apresentação
        </h1>
        <div style={{ height: '2px', background: corSecundaria, width: '60px', marginBottom: '24px' }} />

        <p style={{ color: '#6b7280', fontSize: '10px', marginBottom: '20px' }}>
          {pessoal.localizacao}, {hoje}
        </p>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#1f2937', fontWeight: 600, fontSize: '10.5px' }}>Exmo(a). Sr(a). Responsável de Recrutamento,</p>
          <p style={{ color: '#6b7280', fontSize: '10px' }}>{vaga.empresa}</p>
        </div>

        <div style={{ color: '#374151', lineHeight: 1.7, fontSize: '10.5px' }}>
          {resultado.cartaApresentacao?.split('\n').filter(p => p.trim()).map((paragrafo, i) => (
            <p key={i} style={{ marginBottom: '12px' }}>{paragrafo}</p>
          ))}
        </div>

        <div style={{ marginTop: '28px' }}>
          <p style={{ color: '#374151', marginBottom: '20px', fontSize: '10.5px' }}>Com os melhores cumprimentos,</p>
          <p style={{ fontFamily: fonteTitulo, fontSize: '14px', fontWeight: 700, color: corPrimaria }}>{pessoal.nome}</p>
          <p style={{ color: corSecundaria, fontSize: '10px' }}>{pessoal.titulo}</p>
        </div>
      </div>
    </div>
  )
})
