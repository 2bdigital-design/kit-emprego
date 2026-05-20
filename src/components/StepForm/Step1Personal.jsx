import { useState, useRef } from 'react'
import { useKitStore } from '../../store/kitStore'

export default function Step1Personal() {
  const { pessoal, setPessoal, setEcra, modelo } = useKitStore()
  const [erros, setErros] = useState({})
  const fileRef = useRef()
  const cor = modelo?.corPrimaria || '#2563eb'

  function atualizar(campo, valor) {
    setPessoal({ ...pessoal, [campo]: valor })
    if (erros[campo]) setErros(e => ({ ...e, [campo]: '' }))
  }

  function handleFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPessoal({ ...pessoal, foto: ev.target.result })
    reader.readAsDataURL(file)
  }

  function validar() {
    const novosErros = {}
    if (!pessoal.nome.trim()) novosErros.nome = 'O nome é obrigatório.'
    if (!pessoal.titulo.trim()) novosErros.titulo = 'O título profissional é obrigatório.'
    if (!pessoal.email.trim()) novosErros.email = 'O e-mail é obrigatório.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pessoal.email)) novosErros.email = 'E-mail inválido.'
    if (!pessoal.telefone.trim()) novosErros.telefone = 'O telefone é obrigatório.'
    if (!pessoal.localizacao.trim()) novosErros.localizacao = 'A localização é obrigatória.'
    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  function avancar() {
    if (validar()) setEcra('passo-2')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Dados Pessoais</h2>
        <p className="text-gray-500">As tuas informações de contacto e identificação profissional.</p>
      </div>

      <div className="space-y-5">
        {/* Foto + campos básicos */}
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 transition-colors overflow-hidden bg-gray-50"
            >
              {pessoal.foto ? (
                <img src={pessoal.foto} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <>
                  <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[9px] text-gray-400 text-center px-1">Foto<br/>(opcional)</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            {pessoal.foto && (
              <button onClick={() => setPessoal({ ...pessoal, foto: null })}
                className="text-xs text-gray-400 hover:text-red-500 mt-1 w-full text-center">
                Remover
              </button>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="label">Nome completo *</label>
              <input
                className={`input-field ${erros.nome ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                placeholder="Ex: Maria João Ferreira dos Santos"
                value={pessoal.nome}
                onChange={e => atualizar('nome', e.target.value)}
              />
              {erros.nome && <p className="text-red-500 text-xs mt-1">{erros.nome}</p>}
            </div>

            <div>
              <label className="label">Título profissional *</label>
              <input
                className={`input-field ${erros.titulo ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                placeholder="Ex: Gestora de Recursos Humanos"
                value={pessoal.titulo}
                onChange={e => atualizar('titulo', e.target.value)}
              />
              {erros.titulo && <p className="text-red-500 text-xs mt-1">{erros.titulo}</p>}
            </div>
          </div>
        </div>

        {/* Contactos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">E-mail *</label>
            <input
              type="email"
              className={`input-field ${erros.email ? 'border-red-400 ring-2 ring-red-100' : ''}`}
              placeholder="maria@exemplo.com"
              value={pessoal.email}
              onChange={e => atualizar('email', e.target.value)}
            />
            {erros.email && <p className="text-red-500 text-xs mt-1">{erros.email}</p>}
          </div>
          <div>
            <label className="label">Telefone *</label>
            <input
              className={`input-field ${erros.telefone ? 'border-red-400 ring-2 ring-red-100' : ''}`}
              placeholder="Ex: +244 923 456 789"
              value={pessoal.telefone}
              onChange={e => atualizar('telefone', e.target.value)}
            />
            {erros.telefone && <p className="text-red-500 text-xs mt-1">{erros.telefone}</p>}
          </div>
        </div>

        <div>
          <label className="label">Localização *</label>
          <input
            className={`input-field ${erros.localizacao ? 'border-red-400 ring-2 ring-red-100' : ''}`}
            placeholder="Ex: Luanda, Angola"
            value={pessoal.localizacao}
            onChange={e => atualizar('localizacao', e.target.value)}
          />
          {erros.localizacao && <p className="text-red-500 text-xs mt-1">{erros.localizacao}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">LinkedIn <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input
              className="input-field"
              placeholder="linkedin.com/in/mariasantos"
              value={pessoal.linkedin}
              onChange={e => atualizar('linkedin', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Portfólio / Site <span className="text-gray-400 font-normal">(opcional)</span></label>
            <input
              className="input-field"
              placeholder="mariasantos.com"
              value={pessoal.portfolio}
              onChange={e => atualizar('portfolio', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex justify-between mt-10">
        <button onClick={() => setEcra('modelo')} className="btn-secondary">
          ← Voltar
        </button>
        <button
          onClick={avancar}
          className="btn-primary"
          style={{ background: cor }}
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
