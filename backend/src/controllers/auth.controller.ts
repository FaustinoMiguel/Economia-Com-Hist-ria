import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../config/database.js'
import { toPublicUser, type UserRecord } from '../types/user.js'

async function findUserByEmail(email: string) {
  const [rows] = await pool.query<UserRecord[]>(
    'SELECT * FROM utilizador WHERE email = ? LIMIT 1',
    [email],
  )
  return rows[0] ?? null
}

export async function register(req: Request, res: Response) {
  const {
    name,
    email,
    password,
    province = 'Luanda',
    telemovel = null,
    institution = null,
    course = null,
  } = req.body ?? {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email e password são obrigatórios' })
  }

  const existing = await findUserByEmail(email)
  if (existing) {
    return res.status(409).json({ message: 'Email já registado' })
  }

  const senhaHash = await bcrypt.hash(String(password), 10)

  const [result] = await pool.query(
    `INSERT INTO utilizador
      (nome, email, senha_hash, telemovel, provincia, instituicao, curso, tipo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, senhaHash, telemovel, province, institution, course, 'subscrito'],
  )

  const insertId = (result as { insertId: number }).insertId
  const [rows] = await pool.query<UserRecord[]>(
    'SELECT * FROM utilizador WHERE id = ? LIMIT 1',
    [insertId],
  )

  const user = rows[0]
  if (!user) {
    return res.status(500).json({ message: 'Falha ao criar utilizador' })
  }

  return res.status(201).json({
    user: toPublicUser(user),
  })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    return res.status(400).json({ message: 'email e password são obrigatórios' })
  }

  const user = await findUserByEmail(email)
  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' })
  }

  const valid = await bcrypt.compare(String(password), user.senha_hash)
  if (!valid) {
    return res.status(401).json({ message: 'Credenciais inválidas' })
  }

  await pool.query('UPDATE utilizador SET ultimo_acesso = NOW() WHERE id = ?', [user.id])

  const [freshRows] = await pool.query<UserRecord[]>(
    'SELECT * FROM utilizador WHERE id = ? LIMIT 1',
    [user.id],
  )

  const freshUser = freshRows[0] ?? user
  return res.json({
    user: toPublicUser(freshUser),
  })
}

export async function me(req: Request, res: Response) {
  const userId = req.header('x-user-id')
  const userEmail = req.header('x-user-email')

  if (!userId && !userEmail) {
    return res.status(401).json({ message: 'Não autenticado' })
  }

  let user: UserRecord | undefined
  if (userId) {
    const [rows] = await pool.query<UserRecord[]>(
      'SELECT * FROM utilizador WHERE id = ? LIMIT 1',
      [userId],
    )
    user = rows[0]
  } else if (userEmail) {
    user = await findUserByEmail(userEmail)
  }

  if (!user) {
    return res.status(404).json({ message: 'Utilizador não encontrado' })
  }

  return res.json({ user: toPublicUser(user) })
}
