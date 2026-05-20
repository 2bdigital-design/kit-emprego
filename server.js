import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Env ───────────────────────────────────────────────────────────────────
let env = {}
try {
  const raw = readFileSync(join(__dirname, '.env'), 'utf8')
  raw.split('\n').forEach(line => {
    const [k, ...v] = line.split('=')
    if (k && v.length) env[k.trim()] = v.join('=').trim()
  })
} catch {}

const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY
const JWT_SECRET = env.JWT_SECRET || process.env.JWT_SECRET || 'kit-emprego-secret-2026'
const ADMIN_EMAIL = env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'work.2bdigital@gmail.com'
const ADMIN_SENHA = env.ADMIN_SENHA || process.env.ADMIN_SENHA || '1234578.KITDEEMPREGO'
const PORT = env.PORT || process.env.PORT || 3001

// ─── DB (JSON files) ───────────────────────────────────────────────────────
const DATA_DIR = join(__dirname, 'data')
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR)

function lerDB(nome) {
  const path = join(DATA_DIR, `${nome}.json`)
  if (!existsSync(path)) return []
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return [] }
}

function guardarDB(nome, dados) {
  writeFileSync(join(DATA_DIR, `${nome}.json`), JSON.stringify(dados, null, 2))
}

// ─── Auth helpers ──────────────────────────────────────────────────────────
function normalizarWA(numero) {
  const limpo = numero.replace(/\D/g, '')
  if (limpo.startsWith('244')) return '+' + limpo
  if (limpo.length === 9) return '+244' + limpo
  return '+' + limpo
}

function criarToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' })
}

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ erro: 'Não autenticado.' })
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET)
    const users = lerDB('users')
    const user = users.find(u => u.id === decoded.userId)
    if (!user) return res.status(401).json({ erro: 'Utilizador não encontrado.' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ erro: 'Token inválido.' })
  }
}

function adminAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(403).json({ erro: 'Acesso negado.' })
  try {
    const decoded = jwt.verify(header.slice(7), JWT_SECRET)
    if (!decoded.admin) return res.status(403).json({ erro: 'Acesso negado.' })
    next()
  } catch {
    res.status(403).json({ erro: 'Acesso negado.' })
  }
}

// ─── App ───────────────────────────────────────────────────────────────────
const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ─── Auth routes ───────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { whatsapp, senha, nome } = req.body
    if (!whatsapp || !senha) return res.status(400).json({ erro: 'WhatsApp e senha são obrigatórios.' })
    if (senha.length < 6) return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' })

    const wa = normalizarWA(whatsapp)
    const users = lerDB('users')

    if (users.find(u => u.whatsapp === wa)) {
      return res.status(409).json({ erro: 'Este número já está registado. Faz login.' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)
    const novoUser = { id: uuidv4(), whatsapp: wa, senhaHash, nome: nome || '', acessoPago: false, criadoEm: new Date().toISOString() }
    users.push(novoUser)
    guardarDB('users', users)

    const token = criarToken(novoUser.id)
    res.json({ token, user: { id: novoUser.id, whatsapp: wa, nome: novoUser.nome, acessoPago: false } })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { whatsapp, senha } = req.body
    if (!whatsapp || !senha) return res.status(400).json({ erro: 'WhatsApp e senha são obrigatórios.' })

    // Credenciais de admin
    if (whatsapp === ADMIN_EMAIL && senha === ADMIN_SENHA) {
      const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '8h' })
      return res.json({ token, user: { id: 'admin', isAdmin: true, nome: 'Admin', whatsapp: ADMIN_EMAIL, acessoPago: true } })
    }

    const wa = normalizarWA(whatsapp)
    const users = lerDB('users')
    const user = users.find(u => u.whatsapp === wa)

    if (!user) return res.status(401).json({ erro: 'Número não registado. Cria uma conta primeiro.' })

    const ok = await bcrypt.compare(senha, user.senhaHash)
    if (!ok) return res.status(401).json({ erro: 'Senha incorrecta.' })

    const token = criarToken(user.id)
    res.json({ token, user: { id: user.id, whatsapp: user.whatsapp, nome: user.nome, acessoPago: user.acessoPago } })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.get('/api/auth/me', auth, (req, res) => {
  const { id, whatsapp, nome, acessoPago } = req.user
  res.json({ id, whatsapp, nome, acessoPago })
})

// ─── Kit routes ────────────────────────────────────────────────────────────
app.post('/api/kit/save', auth, (req, res) => {
  try {
    const { dados, resultado, modeloId } = req.body
    const kits = lerDB('kits')
    const kitExistente = kits.findIndex(k => k.userId === req.user.id)

    const kit = {
      id: kitExistente >= 0 ? kits[kitExistente].id : uuidv4(),
      userId: req.user.id,
      dados, resultado, modeloId,
      atualizadoEm: new Date().toISOString()
    }

    if (kitExistente >= 0) kits[kitExistente] = kit
    else kits.push(kit)

    guardarDB('kits', kits)
    res.json({ ok: true, kitId: kit.id })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.get('/api/kit/meu', auth, (req, res) => {
  const kits = lerDB('kits')
  const kit = kits.find(k => k.userId === req.user.id)
  res.json(kit || null)
})

// ─── Pagamento routes ──────────────────────────────────────────────────────
app.post('/api/pagamento/submeter', auth, (req, res) => {
  try {
    const { metodo, referencia, valor, notas } = req.body
    if (!metodo) return res.status(400).json({ erro: 'Método de pagamento obrigatório.' })

    const pagamentos = lerDB('pagamentos')
    // Cancelar pagamentos pendentes anteriores do mesmo user
    pagamentos.forEach(p => {
      if (p.userId === req.user.id && p.estado === 'pendente') p.estado = 'cancelado'
    })

    const novo = {
      id: uuidv4(),
      userId: req.user.id,
      whatsapp: req.user.whatsapp,
      nome: req.user.nome,
      metodo, referencia, valor, notas,
      estado: 'pendente',
      criadoEm: new Date().toISOString()
    }
    pagamentos.push(novo)
    guardarDB('pagamentos', pagamentos)
    res.json({ ok: true, pagamentoId: novo.id })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

app.get('/api/pagamento/meu-estado', auth, (req, res) => {
  const pagamentos = lerDB('pagamentos')
  const ultimo = pagamentos.filter(p => p.userId === req.user.id).sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))[0]
  res.json(ultimo || null)
})

// ─── Admin routes ──────────────────────────────────────────────────────────

app.get('/api/admin/pendentes', adminAuth, (req, res) => {
  const pagamentos = lerDB('pagamentos')
  res.json(pagamentos.filter(p => p.estado === 'pendente').sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)))
})

app.get('/api/admin/usuarios', adminAuth, (req, res) => {
  const users = lerDB('users')
  res.json(users.map(({ senhaHash, ...u }) => u).sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)))
})

app.post('/api/admin/aprovar/:userId', adminAuth, (req, res) => {
  const users = lerDB('users')
  const idx = users.findIndex(u => u.id === req.params.userId)
  if (idx < 0) return res.status(404).json({ erro: 'Utilizador não encontrado.' })
  users[idx].acessoPago = true
  users[idx].aprovadoEm = new Date().toISOString()
  guardarDB('users', users)

  const pagamentos = lerDB('pagamentos')
  pagamentos.forEach(p => { if (p.userId === req.params.userId && p.estado === 'pendente') p.estado = 'aprovado' })
  guardarDB('pagamentos', pagamentos)

  res.json({ ok: true })
})

app.post('/api/admin/revogar/:userId', adminAuth, (req, res) => {
  const users = lerDB('users')
  const idx = users.findIndex(u => u.id === req.params.userId)
  if (idx < 0) return res.status(404).json({ erro: 'Utilizador não encontrado.' })
  users[idx].acessoPago = false
  guardarDB('users', users)
  res.json({ ok: true })
})

app.post('/api/admin/rejeitar/:pagamentoId', adminAuth, (req, res) => {
  const pagamentos = lerDB('pagamentos')
  const idx = pagamentos.findIndex(p => p.id === req.params.pagamentoId)
  if (idx < 0) return res.status(404).json({ erro: 'Pagamento não encontrado.' })
  pagamentos[idx].estado = 'rejeitado'
  guardarDB('pagamentos', pagamentos)
  res.json({ ok: true })
})

// ─── IA routes ─────────────────────────────────────────────────────────────
const client = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null

const SYSTEM_PROMPT = `És um especialista sénior em Recursos Humanos com 20 anos de experiência em recrutamento executivo, revisão de CVs e coaching de carreira em mercados lusófonos, incluindo Angola e Portugal.

O teu papel é gerar dois documentos profissionais perfeitos:
1. Um CV otimizado para a vaga específica
2. Uma Carta de Apresentação personalizada e impactante

Princípios que segues sempre:
CV:
- Começa com um resumo profissional poderoso (3–4 linhas) que posiciona o candidato diretamente para a vaga
- As experiências são escritas com verbos de ação no passado (liderou, implementou, aumentou, reduziu, coordenou)
- As conquistas usam números sempre que possível
- As competências são filtradas e ordenadas por relevância para a vaga
- O tom é sempre profissional, sem exageros nem modéstia excessiva

CARTA DE APRESENTAÇÃO:
- Estrutura: abertura impactante → valor que traz → alinhamento com a empresa → call to action
- A abertura NÃO começa com "Venho por este meio candidatar-me..."
- Comprimento: 3–4 parágrafos, máximo 350 palavras
- Termina com uma frase de call to action confiante

Língua: Português Europeu.
Responde APENAS em JSON válido, sem markdown, sem texto adicional.`

function buildUserPrompt(dados) {
  const { pessoal, experiencias, formacao, competencias, vaga } = dados
  return `DADOS DO CANDIDATO:
Nome: ${pessoal.nome}
Título: ${pessoal.titulo}
Contactos: ${pessoal.email} | ${pessoal.telefone} | ${pessoal.localizacao}
${pessoal.linkedin ? `LinkedIn: ${pessoal.linkedin}` : ''}

EXPERIÊNCIAS:
${experiencias.map((e, i) => `\nExp ${i + 1}: ${e.cargo} na ${e.empresa} (${e.inicio} a ${e.atual ? 'Presente' : e.fim})\nFunções: ${e.descricao}\nConquistas: ${e.conquistas || 'não especificadas'}`).join('')}

FORMAÇÃO:
${formacao.academica.filter(f => f.curso).map(f => `${f.grau} em ${f.curso} — ${f.instituicao} (${f.ano})`).join('\n')}

IDIOMAS: ${formacao.idiomas.filter(i => i.lingua).map(i => `${i.lingua} (${i.nivel})`).join(', ')}
COMPETÊNCIAS TÉCNICAS: ${competencias.tecnicas.join(', ') || 'não indicadas'}
COMPETÊNCIAS TRANSVERSAIS: ${competencias.soft.join(', ') || 'não indicadas'}

VAGA: ${vaga.cargo} na ${vaga.empresa} (${vaga.setor})
Tom da carta: ${vaga.tom}
${vaga.referencia ? `Ref: ${vaga.referencia}` : ''}

DESCRIÇÃO DA VAGA:
${vaga.descricao}

Responde APENAS neste JSON:
{
  "resumoProfissional": "...",
  "experienciasOtimizadas": [{"cargo":"...","empresa":"...","periodo":"...","bullets":["...","...","..."]}],
  "competenciasOrdenadas": ["...","..."],
  "cartaApresentacao": "..."
}`
}

app.post('/api/generate', auth, async (req, res) => {
  if (!client) return res.status(500).json({ erro: 'ANTHROPIC_API_KEY não configurada.' })
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(req.body) }]
    })
    res.json(JSON.parse(msg.content[0].text))
  } catch (err) {
    if (err instanceof SyntaxError) return res.status(500).json({ erro: 'Resposta inesperada da IA. Tenta novamente.' })
    res.status(500).json({ erro: err.message })
  }
})

app.post('/api/refine', auth, async (req, res) => {
  if (!client) return res.status(500).json({ erro: 'ANTHROPIC_API_KEY não configurada.' })
  try {
    const { resultado, instrucao, dados } = req.body
    const prompt = `Kit atual:\n${JSON.stringify(resultado, null, 2)}\n\nInstrução: "${instrucao}"\n\nDados originais:\n${buildUserPrompt(dados)}\n\nAplica o ajuste e devolve o kit completo no mesmo formato JSON.`
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }]
    })
    res.json(JSON.parse(msg.content[0].text))
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
})

// ─── Produção: serve React build ───────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')))
  app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')))
}

app.listen(PORT, () => {
  console.log(`\n🚀 Kit de Emprego — Servidor: http://localhost:${PORT}`)
  console.log(`   API Key: ${ANTHROPIC_API_KEY ? '✅ Configurada' : '❌ Falta — adiciona ao .env'}`)
  console.log(`   Modo: ${process.env.NODE_ENV || 'development'}`)
})
