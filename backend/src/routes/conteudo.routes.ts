import { Router } from 'express'
import {
  createConteudo,
  deleteConteudo,
  getConteudoById,
  listConteudos,
  updateConteudo,
} from '../controllers/conteudo.controller.js'

export const conteudoRouter = Router()

conteudoRouter.get('/', listConteudos)
conteudoRouter.get('/:id', getConteudoById)
conteudoRouter.post('/', createConteudo)
conteudoRouter.put('/:id', updateConteudo)
conteudoRouter.delete('/:id', deleteConteudo)
