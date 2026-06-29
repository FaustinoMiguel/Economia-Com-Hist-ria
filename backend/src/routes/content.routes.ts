import { Router } from 'express'
import {
  adicionarPlaylist,
  atualizarComentario,
  atualizarConteudo,
  criarComentario,
  criarConteudo,
  denunciarConteudo,
  gostarComentario,
  guardarConteudo,
  listarComentarios,
  listarConteudos,
  listarPedidosDoMeuConteudo,
  listarPlaylist,
  obterEstadoUsuario,
  reagirConteudo,
  registrarVisualizacao,
  removerComentario,
  removerConteudo,
  removerPlaylist,
  responderPedidoAcesso,
  solicitarAcessoConteudo,
  uploadConteudoFicheiro,
} from '../controllers/content.controller.js'
import { authenticate, authenticateOptional } from '../middlewares/authenticate.js'
import { requireProfessorOuAdmin } from '../middlewares/requireRole.js'
import { uploadContent } from '../middlewares/uploadContent.js'

export const contentRouter = Router()

contentRouter.get('/', listarConteudos)
contentRouter.post('/upload', authenticate, uploadContent, uploadConteudoFicheiro)
contentRouter.post('/', authenticate, criarConteudo)
contentRouter.get('/me/state', authenticate, obterEstadoUsuario)
contentRouter.get('/me/playlist', authenticate, listarPlaylist)
contentRouter.post('/me/playlist', authenticate, adicionarPlaylist)
contentRouter.delete('/me/playlist/:contentId/:episodeId', authenticate, removerPlaylist)
// Pedidos de acesso Jindungo — só o criador do conteúdo pode ver e responder
contentRouter.get('/me/access-requests', authenticate, requireProfessorOuAdmin, listarPedidosDoMeuConteudo)
contentRouter.patch('/access-requests/:pedidoId', authenticate, requireProfessorOuAdmin, responderPedidoAcesso)
contentRouter.post('/:id/view', registrarVisualizacao)
contentRouter.post('/:id/reaction', authenticate, reagirConteudo)
contentRouter.post('/:id/save', authenticate, guardarConteudo)
contentRouter.post('/:id/report', authenticate, denunciarConteudo)
contentRouter.post('/:id/access-request', authenticate, solicitarAcessoConteudo)
contentRouter.get('/:id/comments', authenticateOptional, listarComentarios)
contentRouter.post('/:id/comments', authenticate, criarComentario)
contentRouter.patch('/comments/:commentId', authenticate, atualizarComentario)
contentRouter.delete('/comments/:commentId', authenticate, removerComentario)
contentRouter.post('/comments/:commentId/like', authenticate, gostarComentario)

// Editar/eliminar conteúdo (autor ou admin) — declaradas no fim para não
// colidir com /me/* nem /comments/*.
contentRouter.put('/:id', authenticate, atualizarConteudo)
contentRouter.delete('/:id', authenticate, removerConteudo)
