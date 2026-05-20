import { useEffect } from 'react'
import { useKitStore } from './store/kitStore'
import Auth from './components/Auth'
import ModelSelector from './components/ModelSelector'
import ProgressBar from './components/ProgressBar'
import Step1Personal from './components/StepForm/Step1Personal'
import Step2Experience from './components/StepForm/Step2Experience'
import Step3Education from './components/StepForm/Step3Education'
import Step4Job from './components/StepForm/Step4Job'
import Loading from './components/Loading'
import NormalPreview from './components/NormalPreview'
import PaymentModal from './components/PaymentModal'
import PaymentPending from './components/PaymentPending'
import AdminPanel from './components/AdminPanel'
import ExportModal from './components/ExportModal'

const PASSOS = ['passo-1', 'passo-2', 'passo-3', 'passo-4']

export default function App() {
  const { ecra, auth, modelo, setEcra, logout } = useKitStore()

  // Redirecionar para auth se não estiver logado (excepto no admin)
  useEffect(() => {
    if (!auth && ecra !== 'admin') {
      setEcra('auth')
    } else if (auth && ecra === 'auth') {
      setEcra(modelo ? 'passo-1' : 'modelo')
    }
  }, [auth])

  // ─── Ecrãs sem auth ───────────────────────────────────────
  if (ecra === 'auth') return <Auth />
  if (ecra === 'admin') return <AdminPanel />

  // ─── Guard: auth obrigatório a partir daqui ───────────────
  if (!auth) return <Auth />

  if (ecra === 'modelo') return <ModelSelector />
  if (ecra === 'gerando') return <Loading />
  if (ecra === 'preview') return <NormalPreview />
  if (ecra === 'pagamento') return <PaymentModal />
  if (ecra === 'aguardar') return <PaymentPending />
  if (ecra === 'exportar') return <ExportModal onClose={() => setEcra('preview')} />

  if (PASSOS.includes(ecra)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setEcra('modelo')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: modelo?.corPrimaria || '#2563eb' }}>
              KE
            </div>
            <span className="font-semibold text-sm hidden sm:inline">Kit de Emprego</span>
          </button>

          <div className="flex items-center gap-2">
            {auth.user?.nome && (
              <span className="text-xs text-gray-400 hidden sm:inline">
                👤 {auth.user.nome}
                {auth.user.acessoPago && <span className="ml-1 text-green-600">· Pago ✅</span>}
              </span>
            )}
            <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-all">
              Sair
            </button>
          </div>
        </div>

        <ProgressBar />

        <div className="min-h-[calc(100vh-112px)]">
          {ecra === 'passo-1' && <Step1Personal />}
          {ecra === 'passo-2' && <Step2Experience />}
          {ecra === 'passo-3' && <Step3Education />}
          {ecra === 'passo-4' && <Step4Job />}
        </div>
      </div>
    )
  }

  return <Auth />
}
