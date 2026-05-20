import { useState } from 'react'
import { useKitStore } from '../../store/kitStore'
import { MODELOS } from '../../config/models'

function MiniCV({ modelo }) {
  return (
    <div style={{ fontFamily: modelo.fonteCorpo, fontSize: '5px', lineHeight: 1.3 }}
      className="w-full h-full overflow-hidden">
      {modelo.layout === 'A' && (
        <div className="flex h-full">
          <div style={{ background: modelo.corPrimaria, width: '35%', padding: '6px 4px' }}>
            <div style={{ background: 'rgba(255,255,255,0.3)', height: '16px', width: '16px', borderRadius: '50%', margin: '0 auto 4px' }} />
            <div style={{ background: 'rgba(255,255,255,0.5)', height: '2px', marginBottom: '2px', borderRadius: '1px' }} />
            <div style={{ background: 'rgba(255,255,255,0.3)', height: '1.5px', marginBottom: '1.5px', borderRadius: '1px' }} />
            <div style={{ background: 'rgba(255,255,255,0.3)', height: '1.5px', marginBottom: '4px', borderRadius: '1px' }} />
            <div style={{ background: modelo.corSecundaria, height: '1.5px', width: '60%', borderRadius: '1px', marginBottom: '2px' }} />
            {[1,2,3].map(i => <div key={i} style={{ background: 'rgba(255,255,255,0.4)', height: '1.5px', marginBottom: '1.5px', borderRadius: '1px' }} />)}
          </div>
          <div style={{ flex: 1, padding: '6px 4px' }}>
            <div style={{ background: modelo.corPrimaria, height: '4px', width: '70%', borderRadius: '1px', marginBottom: '1.5px' }} />
            <div style={{ background: modelo.corSecundaria, height: '2px', width: '50%', borderRadius: '1px', marginBottom: '4px' }} />
            <div style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1px', borderRadius: '1px' }} />
            <div style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1px', borderRadius: '1px', width: '85%' }} />
            <div style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '4px', borderRadius: '1px', width: '70%' }} />
            <div style={{ background: modelo.corPrimaria, height: '2px', width: '40%', borderRadius: '1px', marginBottom: '2px' }} />
            {[1,2].map(i => (
              <div key={i} style={{ marginBottom: '3px' }}>
                <div style={{ background: '#cbd5e1', height: '1.5px', marginBottom: '1px', borderRadius: '1px' }} />
                {[1,2].map(j => <div key={j} style={{ background: '#e2e8f0', height: '1px', marginBottom: '1px', borderRadius: '1px', width: '90%' }} />)}
              </div>
            ))}
          </div>
        </div>
      )}
      {modelo.layout === 'B' && (
        <div>
          <div style={{ background: modelo.corPrimaria, padding: '5px 6px', marginBottom: '4px' }}>
            <div style={{ background: 'rgba(255,255,255,0.9)', height: '4px', width: '60%', borderRadius: '1px', marginBottom: '2px' }} />
            <div style={{ background: 'rgba(255,255,255,0.5)', height: '1.5px', width: '80%', borderRadius: '1px' }} />
          </div>
          <div style={{ padding: '0 5px' }}>
            <div style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1px', borderRadius: '1px' }} />
            <div style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '4px', borderRadius: '1px', width: '80%' }} />
            <div className="flex gap-1">
              <div style={{ flex: 2 }}>
                <div style={{ background: modelo.corSecundaria, height: '2px', width: '50%', borderRadius: '1px', marginBottom: '2px' }} />
                {[1,2,3].map(i => <div key={i} style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1.5px', borderRadius: '1px' }} />)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ background: modelo.corPrimaria, height: '2px', width: '70%', borderRadius: '1px', marginBottom: '2px' }} />
                {[1,2,3].map(i => <div key={i} style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1.5px', borderRadius: '1px' }} />)}
              </div>
            </div>
          </div>
        </div>
      )}
      {modelo.layout === 'C' && (
        <div style={{ padding: '6px 5px' }}>
          <div style={{ background: modelo.corPrimaria, height: '4px', width: '55%', borderRadius: '1px', marginBottom: '1.5px' }} />
          <div style={{ background: '#94a3b8', height: '1.5px', width: '40%', borderRadius: '1px', marginBottom: '2px' }} />
          <div style={{ background: modelo.corPrimaria, height: '1px', marginBottom: '2px' }} />
          <div style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1px', borderRadius: '1px' }} />
          <div style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '3px', borderRadius: '1px', width: '80%' }} />
          <div style={{ background: modelo.corPrimaria, height: '1px', marginBottom: '2px' }} />
          {[1,2,3].map(i => <div key={i} style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1.5px', borderRadius: '1px' }} />)}
        </div>
      )}
    </div>
  )
}

function MiniCarta({ modelo }) {
  return (
    <div style={{ fontFamily: modelo.fonteCorpo, fontSize: '5px' }}
      className="w-full h-full overflow-hidden">
      {modelo.layout === 'A' && (
        <div className="flex h-full">
          <div style={{ background: modelo.corPrimaria, width: '35%', padding: '6px 4px' }}>
            <div style={{ background: 'rgba(255,255,255,0.3)', height: '16px', width: '16px', borderRadius: '50%', margin: '0 auto 4px' }} />
            <div style={{ background: 'rgba(255,255,255,0.5)', height: '2px', marginBottom: '2px', borderRadius: '1px' }} />
            <div style={{ background: 'rgba(255,255,255,0.3)', height: '1.5px', borderRadius: '1px' }} />
          </div>
          <div style={{ flex: 1, padding: '6px 4px' }}>
            <div style={{ background: modelo.corPrimaria, height: '3px', width: '65%', borderRadius: '1px', marginBottom: '1.5px' }} />
            <div style={{ background: modelo.corSecundaria, height: '1.5px', width: '45%', borderRadius: '1px', marginBottom: '5px' }} />
            {[1,2,3,4,5].map(i => <div key={i} style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1px', borderRadius: '1px', width: i === 5 ? '50%' : '90%' }} />)}
            <div style={{ marginTop: '3px' }}>
              {[1,2,3,4].map(i => <div key={i} style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1px', borderRadius: '1px', width: '85%' }} />)}
            </div>
          </div>
        </div>
      )}
      {modelo.layout === 'B' && (
        <div>
          <div style={{ background: modelo.corPrimaria, padding: '5px 6px', marginBottom: '4px' }}>
            <div style={{ background: 'rgba(255,255,255,0.9)', height: '3px', width: '55%', borderRadius: '1px', marginBottom: '1.5px' }} />
            <div style={{ background: 'rgba(255,255,255,0.5)', height: '1.5px', width: '70%', borderRadius: '1px' }} />
          </div>
          <div style={{ padding: '0 5px' }}>
            <div style={{ background: '#94a3b8', height: '1px', marginBottom: '2px' }} />
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1px', borderRadius: '1px', width: i % 3 === 0 ? '60%' : '90%' }} />)}
          </div>
        </div>
      )}
      {modelo.layout === 'C' && (
        <div style={{ padding: '6px 5px' }}>
          <div style={{ background: modelo.corPrimaria, height: '3px', width: '50%', borderRadius: '1px', marginBottom: '1.5px' }} />
          <div style={{ background: modelo.corPrimaria, height: '1px', marginBottom: '3px' }} />
          <div style={{ background: '#94a3b8', height: '1.5px', width: '55%', borderRadius: '1px', marginBottom: '3px' }} />
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ background: '#e2e8f0', height: '1.5px', marginBottom: '1px', borderRadius: '1px', width: i % 4 === 0 ? '55%' : '88%' }} />)}
        </div>
      )}
    </div>
  )
}

export default function ModelSelector() {
  const [hoverId, setHoverId] = useState(null)
  const setModelo = useKitStore(s => s.setModelo)

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-blue-50">
      {/* Header */}
      <div className="text-center pt-16 pb-10 px-4">
        <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.977 3.977 0 01-.716.574L12 21l-2.373-1.65a4 4 0 01-.716-.574l-.347-.347z" />
          </svg>
          Gerado com Inteligência Artificial
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Escolhe o teu modelo
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          O mesmo design será aplicado ao teu CV e à tua Carta de Apresentação.
        </p>
      </div>

      {/* Grid de modelos */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {MODELOS.map(modelo => (
            <div
              key={modelo.id}
              onMouseEnter={() => setHoverId(modelo.id)}
              onMouseLeave={() => setHoverId(null)}
              className={`group bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden cursor-pointer
                ${hoverId === modelo.id
                  ? 'border-brand-500 shadow-xl shadow-brand-100 -translate-y-1'
                  : 'border-gray-100 shadow-sm hover:shadow-md'}`}
            >
              {/* Miniaturas */}
              <div className="flex gap-0 h-32 bg-gray-50">
                <div className="flex-1 border-r border-gray-100 overflow-hidden">
                  <div className="text-center py-1">
                    <span className="text-[9px] text-gray-400 font-medium">CV</span>
                  </div>
                  <div className="h-[calc(100%-20px)]">
                    <MiniCV modelo={modelo} />
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-center py-1">
                    <span className="text-[9px] text-gray-400 font-medium">CARTA</span>
                  </div>
                  <div className="h-[calc(100%-20px)]">
                    <MiniCarta modelo={modelo} />
                  </div>
                </div>
              </div>

              {/* Info do modelo */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: modelo.corPrimaria }}
                    />
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: modelo.corSecundaria }}
                    />
                    <span className="font-semibold text-gray-900 text-sm">{modelo.nome}</span>
                  </div>
                  <p className="text-xs text-gray-400 ml-8">{modelo.descricao}</p>
                </div>
                <button
                  onClick={() => setModelo(modelo)}
                  className="flex-shrink-0 ml-3 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-white active:scale-95"
                  style={{ background: hoverId === modelo.id ? modelo.corPrimaria : '#2563eb' }}
                >
                  Usar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
