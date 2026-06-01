import { Router } from 'express'
import { createUser, deleteUser, getUser, listUsers, updateUser } from '../controllers/user.controller.js'
import { requireAdmin } from '../middlewares/requireAdmin.js'

export const usersRouter = Router()

usersRouter.use(requireAdmin)
usersRouter.get('/', listUsers)
usersRouter.post('/', createUser)
usersRouter.get('/:id', getUser)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)
