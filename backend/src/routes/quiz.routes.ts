/**
 * quiz.routes.ts
 *
 * Novas rotas adicionadas:
 *  GET  /quizzes/meus       — PONTO 3: lista os quizzes do admin autenticado
 *  POST /quizzes/gerar-ia   — PONTO 4: gera quiz via Groq e devolve payload (sem guardar)
 *
 * IMPORTANTE — ordem das rotas:
 *  As rotas literais (/meus, /gerar-ia, /completo) ficam ANTES de /:id
 *  para o Express não as interpretar como parâmetro.
 */
import { Router } from 'express'
import {
  listQuizzes, listMeusQuizzes,
  getQuiz,
  createQuiz, createQuizComPerguntas,
  updateQuiz, updateQuizComPerguntas,
  deleteQuiz,
  gerarQuiz,
  addPergunta, deletePergunta,
  submitAttempt, quizRanking, quizStats,
} from '../controllers/quiz.controller.js'
import { authenticate }              from '../middlewares/authenticate.js'
import { requireAdmin, requireAuth } from '../middlewares/requireRole.js'

export const quizRouter = Router()

// ── Rotas literais — DEVEM ficar antes de /:id ────────────────────────────────

// PONTO 3 — lista do admin (só os seus)
quizRouter.get('/meus', authenticate, requireAdmin, listMeusQuizzes)

// PONTO 4 — geração por IA (devolve payload, não guarda)
quizRouter.post('/gerar-ia', authenticate, requireAdmin, gerarQuiz)

// PONTO 9 — criação atómica (quiz + perguntas em bloco)
quizRouter.post('/completo', authenticate, requireAdmin, createQuizComPerguntas)

// ── Listagem e detalhe ────────────────────────────────────────────────────────

// PONTO 1 — alunos vêem só activos; staff vê tudo
quizRouter.get('/', authenticate, listQuizzes)

// PONTO 2 — detalhe sem resposta_correta para alunos
quizRouter.get('/:id', authenticate, getQuiz)

// ── Criação simples (só metadados) ────────────────────────────────────────────
quizRouter.post('/', authenticate, requireAdmin, createQuiz)

// ── Actualização ──────────────────────────────────────────────────────────────

// Metadados simples — PONTO 8: ownership verificado no controller
quizRouter.put('/:id', authenticate, requireAdmin, updateQuiz)

// PONTO 10 + PONTO 8 — replace-all com ownership
quizRouter.put('/:id/completo', authenticate, requireAdmin, updateQuizComPerguntas)

// ── Perguntas individuais (compatibilidade com fluxo antigo) ──────────────────
quizRouter.post  ('/:id/perguntas',             authenticate, requireAdmin, addPergunta)
quizRouter.delete('/:id/perguntas/:perguntaId', authenticate, requireAdmin, deletePergunta)

// ── Tentativas e estatísticas ─────────────────────────────────────────────────
quizRouter.post('/:id/attempt', authenticate, requireAuth, submitAttempt)
quizRouter.get ('/:id/ranking', authenticate,              quizRanking)
quizRouter.get ('/:id/stats',   authenticate, requireAdmin, quizStats)

// PONTO 8 — apagar com ownership
quizRouter.delete('/:id', authenticate, requireAdmin, deleteQuiz)
