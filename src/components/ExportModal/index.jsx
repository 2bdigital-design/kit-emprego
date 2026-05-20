import { useState, useRef } from 'react'
import { useKitStore } from '../../store/kitStore'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { CvLayoutA, CartaLayoutA } from '../Templates/LayoutA'
import { CvLayoutB, CartaLayoutB } from '../Templates/LayoutB'
import { CvLayoutC, CartaLayoutC } from '../Templates/LayoutC'
import { MODELOS } from '../../config/models'

function getTemplates(layout) {
  if (layout === 'A') return { Cv: CvLayoutA, Carta: CartaLayoutA }
  if (layout === 'B') return { Cv: CvLayoutB, Carta: CartaLayoutB }
  return { Cv: CvLayoutC, Carta: CartaLayoutC }
}

async function htmlParaPdf(elemento, nomeArquivo) {
  const canvas = await html2canvas(elemento, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' })
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight())
  pdf.save(nomeArquivo)
}

function slugify(str) {
  return (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 30)
}

export default function ExportModal({ onClose }) {
  const { modelo: modeloAtual, pessoal, resultado, experiencias, formacao, competencias, vaga, setModelo, setEcra, auth } = useKitStore()
  const [modeloSelecionado, setModeloSelecionado] = useState(modeloAtual)
  const [selecao, setSelecao] = useState('kit')
  const [formato, setFormato] = useState('pdf')
  const [exportando, setExportando] = useState(false)
  const cvRef = useRef()
  const cartaRef = useRef()
  const cor = modeloSelecionado?.corPrimaria || '#2563eb'

  const { Cv, Carta } = getTemplates(modeloSelecionado?.layout || 'B')
  const props = { modelo: modeloSelecionado, pessoal, resultado, experiencias, formacao, competencias, vaga }

  const nomeSlug = slugify(pessoal.nome)
  const cargoSlug = slugify(vaga.cargo)
  const empresaSlug = slugify(vaga.empresa)

  async function exportar() {
    setExportando(true)
    try {
      if (formato === 'pdf' || formato === 'ambos') {
        if (selecao !== 'carta' && cvRef.current) await htmlParaPdf(cvRef.current, `CV_${nomeSlug}.pdf`)
        if (selecao !== 'cv' && cartaRef.current) await htmlParaPdf(cartaRef.current, `Carta_${nomeSlug}_${empresaSlug}.pdf`)
      }
      if (formato === 'docx' || formato === 'ambos') {
        const { gerarDocxKit } = await import('../../utils/docxExporter')
        await gerarDocxKit({ pessoal, vaga, resultado, selecao, nomeSlug, cargoSlug, empresaSlug })
      }
    } catch (err) {
      alert('Erro ao exportar: ' + err.message)
    } finally {
      setExportando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="font-bold text-gray-900">Exportar Kit</h2>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Selector de tema */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            🎨 Escolhe o tema para exportar
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Acesso Pago ✅</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MODELOS.map(m => (
              <button key={m.id} onClick={() => setModeloSelecionado(m)}
                className={`p-2 rounded-xl border-2 text-center transition-all ${modeloSelecionado?.id === m.id ? 'border-brand-500 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <div className="flex gap-1 justify-center mb-1">
                  <span className="w-3 h-3 rounded-full" style={{ background: m.corPrimaria }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: m.corSecundaria }} />
                </div>
                <p className="text-xs font-medium text-gray-700 leading-tight">{m.nome}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview A4 oculto (para captura) */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <Cv ref={cvRef} {...props} />
          <Carta ref={cartaRef} {...props} />
        </div>

        {/* Opções */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3">O que exportar</h3>
          {[
            { val: 'kit', label: 'CV + Carta juntos', icon: '📦' },
            { val: 'cv', label: 'Apenas o CV', icon: '📄' },
            { val: 'carta', label: 'Apenas a Carta', icon: '✉' }
          ].map(op => (
            <label key={op.val} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer mb-2 transition-all ${selecao === op.val ? 'border-transparent' : 'border-gray-100 bg-white'}`}
              style={selecao === op.val ? { borderColor: cor, background: `${cor}08` } : {}}>
              <input type="radio" name="selecao" checked={selecao === op.val} onChange={() => setSelecao(op.val)} className="hidden" />
              <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center" style={selecao === op.val ? { borderColor: cor } : { borderColor: '#d1d5db' }}>
                {selecao === op.val && <div className="w-2 h-2 rounded-full" style={{ background: cor }} />}
              </div>
              <span className="text-sm">{op.icon} {op.label}</span>
            </label>
          ))}

          <h3 className="font-semibold text-gray-700 mb-3 mt-4">Formato</h3>
          <div className="grid grid-cols-3 gap-2">
            {[{ val: 'pdf', label: 'PDF' }, { val: 'docx', label: 'DOCX' }, { val: 'ambos', label: 'Ambos' }].map(f => (
              <button key={f.val} onClick={() => setFormato(f.val)}
                className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${formato === f.val ? 'text-white' : 'text-gray-600 border-gray-100 bg-white'}`}
                style={formato === f.val ? { background: cor, borderColor: cor } : {}}>
                {f.label}
              </button>
            ))}
          </div>

          <button onClick={exportar} disabled={exportando}
            className="w-full py-3 rounded-xl font-bold text-white mt-5 transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: cor }}>
            {exportando ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>A exportar...</>
            ) : '⬇️ Exportar agora'}
          </button>
        </div>
      </div>
    </div>
  )
}
