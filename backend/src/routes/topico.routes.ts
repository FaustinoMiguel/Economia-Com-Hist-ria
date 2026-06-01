import { Router } from 'express'
import {
  createTopico,
  deleteTopico,
  getTopicoById,
  listTopicos,
  updateTopico,
} from '../controllers/topico.controller.js'

export const topicoRouter = Router()

topicoRouter.get('/', listTopicos)
topicoRouter.get('/:id', getTopicoById)
topicoRouter.post('/', createTopico)
topicoRouter.put('/:id', updateTopico)
topicoRouter.delete('/:id', deleteTopico)
