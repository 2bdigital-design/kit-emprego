import { create } from 'zustand'

const KIT_KEY = 'kit-emprego-kit'
const AUTH_KEY = 'kit-emprego-auth'

const kitInicial = {
  modelo: null,
  pessoal: { nome: '', titulo: '', email: '', telefone: '', localizacao: '', linkedin: '', portfolio: '', foto: null },
  experiencias: [{ id: 1, cargo: '', empresa: '', inicio: '', fim: '', atual: false, descricao: '', conquistas: '' }],
  formacao: {
    academica: [{ id: 1, grau: 'Licenciatura', curso: '', instituicao: '', ano: '', distincao: '' }],
    certificados: [{ id: 1, nome: '', inst: '', ano: '' }],
    idiomas: [{ id: 1, lingua: 'Português', nivel: 'Nativo' }]
  },
  competencias: { tecnicas: [], soft: [] },
  vaga: { cargo: '', empresa: '', setor: '', descricao: '', requisitos: '', tom: 'formal', referencia: '' },
  resultado: { gerado: false, loading: false, erro: null, resumoProfissional: '', experienciasOtimizadas: [], competenciasOrdenadas: [], cartaApresentacao: '' }
}

function lerStorage(chave, fallback) {
  try { return JSON.parse(localStorage.getItem(chave)) || fallback } catch { return fallback }
}

function guardarKit(state) {
  const { resultado, ...resto } = state
  localStorage.setItem(KIT_KEY, JSON.stringify(resto))
}

export const useKitStore = create((set, get) => ({
  // ─── Ecrã ────────────────────────────────────────────────────────────
  ecra: 'auth', // auth | modelo | passo-1..4 | gerando | preview | pagamento | aguardar | admin

  // ─── Auth ─────────────────────────────────────────────────────────────
  auth: lerStorage(AUTH_KEY, null), // { token, user: { id, whatsapp, nome, acessoPago } }

  // ─── Kit ──────────────────────────────────────────────────────────────
  ...lerStorage(KIT_KEY, kitInicial),

  // ─── Navegação ────────────────────────────────────────────────────────
  setEcra: (ecra) => set({ ecra }),

  // ─── Auth actions ─────────────────────────────────────────────────────
  setAuth: (authData) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
    if (authData?.user?.isAdmin) {
      set({ auth: authData, ecra: 'admin' })
      return
    }
    const ecraDestino = authData ? (lerStorage(KIT_KEY, null)?.modelo ? 'passo-1' : 'modelo') : 'auth'
    set({ auth: authData, ecra: ecraDestino })
  },

  atualizarUser: (novoUser) => {
    const { auth } = get()
    if (!auth) return
    const atualizado = { ...auth, user: { ...auth.user, ...novoUser } }
    localStorage.setItem(AUTH_KEY, JSON.stringify(atualizado))
    set({ auth: atualizado })
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(KIT_KEY)
    set({ auth: null, ecra: 'auth', ...kitInicial })
  },

  // ─── Kit actions ──────────────────────────────────────────────────────
  setModelo: (modelo) => {
    set({ modelo, ecra: 'passo-1' })
    guardarKit({ ...get(), modelo })
  },

  setPessoal: (pessoal) => { set({ pessoal }); guardarKit({ ...get(), pessoal }) },

  setExperiencias: (experiencias) => { set({ experiencias }); guardarKit({ ...get(), experiencias }) },

  adicionarExperiencia: () => {
    const { experiencias } = get()
    if (experiencias.length >= 5) return
    const novas = [...experiencias, { id: Date.now(), cargo: '', empresa: '', inicio: '', fim: '', atual: false, descricao: '', conquistas: '' }]
    set({ experiencias: novas }); guardarKit({ ...get(), experiencias: novas })
  },

  removerExperiencia: (id) => {
    const { experiencias } = get()
    if (experiencias.length <= 1) return
    const novas = experiencias.filter(e => e.id !== id)
    set({ experiencias: novas }); guardarKit({ ...get(), experiencias: novas })
  },

  atualizarExperiencia: (id, campo, valor) => {
    const novas = get().experiencias.map(e => e.id === id ? { ...e, [campo]: valor } : e)
    set({ experiencias: novas }); guardarKit({ ...get(), experiencias: novas })
  },

  setFormacao: (formacao) => { set({ formacao }); guardarKit({ ...get(), formacao }) },
  setCompetencias: (competencias) => { set({ competencias }); guardarKit({ ...get(), competencias }) },
  setVaga: (vaga) => { set({ vaga }); guardarKit({ ...get(), vaga }) },
  setResultado: (resultado) => set({ resultado }),

  reiniciarKit: () => {
    localStorage.removeItem(KIT_KEY)
    set({ ...kitInicial, ecra: 'modelo' })
  }
}))
