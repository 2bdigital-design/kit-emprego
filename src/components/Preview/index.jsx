import { useState, useRef } from 'react'
import { useKitStore } from '../../store/kitStore'
import { CvLayoutA, CartaLayoutA } from '../Templates/LayoutA'
import { CvLayoutB, CartaLayoutB } from '../Templates/LayoutB'
import { CvLayoutC, CartaLayoutC } from '../Templates/LayoutC'
import ExportModal from '../ExportModal'
import AIChat from '../AIChat'

function getTemplates(layout) {
  if (layout === 'A') return { Cv: CvLayoutA, Carta: CartaLayoutA }
  if (layout === 'B') return { Cv: CvLayoutB, Carta: CartaLayoutB }
  return { Cv: CvLayoutC, Carta: CartaLayoutC }
}

export default function Preview() {
  const { modelo, pessoal, experiencias, formacao, competencias, vaga, resultado, setEcra } = useKitStore()
  const [aba, setAba] = useState('cv')
  const [mostrarExport, setMostrarExport] = useState(false)
  const [mostrarChat, setMostrarChat] = useState(false)
  const cvRef = useRef()
  const cartaRef = useRef()
  const cor = modelo?.corPrimaria || '#2563eb'

  const { Cv, Carta } = getTemplates(modelo?.layout || 'B')

  const props = { modelo, pessoal, resultado, experiencias, formacao, competencias, vaga }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Barra superior */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setAba('cv')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${aba === 'cv' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              📄 CV
            </button>
            <button
              onClick={() => setAba('carta')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${aba === 'carta' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ✉ Carta
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setEcra('passo-4')} className="btn-ghost text-sm hidden sm:flex items-center gap-1">
              ← Editar dados
            </button>
            <button
              onClick={() => setMostrarChat(true)}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              ✏️ <span className="hidden sm:inline">Ajustar com IA</span>
            </button>
            <button
              onClick={() => setMostrarExport(true)}
              className="btn-primary text-sm flex items-center gap-2"
              style={{ background: cor }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar Kit
            </button>
          </div>
        </div>
      </div>

      {/* Área de preview */}
      <div className="flex-1 overflow-auto py-8 px-4">
        <div className="max-w-[900px] mx-auto">
          {/* Badge do modelo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-3 h-3 rounded-full" style={{ background: cor }} />
            <span className="text-sm text-gray-500 font-medium">{modelo?.nome} · Layout {modelo?.layout}</span>
          </div>

          {/* Documentos */}
          <div className={`transition-all duration-300 ${aba === 'cv' ? 'block' : 'hidden'}`}>
            <Cv ref={cvRef} {...props} />
          </div>
          <div className={`transition-all duration-300 ${aba === 'carta' ? 'block' : 'hidden'}`}>
            <Carta ref={cartaRef} {...props} />
          </div>
        </div>
      </div>

      {/* Modais */}
      {mostrarExport && (
        <ExportModal
          onClose={() => setMostrarExport(false)}
          cvRef={cvRef}
          cartaRef={cartaRef}
          modelo={modelo}
          pessoal={pessoal}
          vaga={vaga}
          resultado={resultado}
        />
      )}

      {mostrarChat && (
        <AIChat onClose={() => setMostrarChat(false)} />
      )}
    </div>
  )
}
