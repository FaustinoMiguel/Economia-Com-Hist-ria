import type { Request, Response } from 'express'
import { pool } from '../config/database.js'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'

type TopicoRow = RowDataPacket & {
  id: number
  titulo: string
  descricao: string
  criado_por: number
  tipo_privacidade: 'publico' | 'privado'
  categoria: string | null
  requires_access: number | 0 | 1
  likes: number
  respostas: number
  criado_em: string
  ultima_atividade: string
}

function toBoolean(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

export async function listTopicos(_req: Request, res: Response) {
  const [rows] = await pool.query<TopicoRow[]>(
    'SELECT * FROM topico_forum ORDER BY ultima_atividade DESC, id DESC',
  )
  res.json(rows)
}

export async function getTopicoById(req: Request, res: Response) {
  const [rows] = await pool.query<TopicoRow[]>(
    'SELECT * FROM topico_forum WHERE id = ? LIMIT 1',
    [req.params.id],
  )

  const topico = rows[0]
  if (!topico) {
    return res.status(404).json({ message: 'Tópico não encontrado' })
  }

  return res.json(topico)
}

export async function createTopico(req: Request, res: Response) {
  const {
    titulo,
    descricao,
    criado_por,
    tipo_privacidade = 'publico',
    categoria = null,
    requires_access = false,
  } = req.body ?? {}

  if (!titulo || !descricao || !criado_por) {
    return res.status(400).json({ message: 'titulo, descricao e criado_por são obrigatórios' })
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO topico_forum
      (titulo, descricao, criado_por, tipo_privacidade, categoria, requires_access)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      titulo,
      descricao,
      criado_por,
      tipo_privacidade,
      categoria,
      toBoolean(requires_access) ? 1 : 0,
    ],
  )

  const [rows] = await pool.query<TopicoRow[]>(
    'SELECT * FROM topico_forum WHERE id = ? LIMIT 1',
    [result.insertId],
  )

  return res.status(201).json(rows[0])
}

export async function updateTopico(req: Request, res: Response) {
  const id = req.params.id
  const fields = req.body ?? {}

  const allowedFields = [
    'titulo',
    'descricao',
    'criado_por',
    'tipo_privacidade',
    'categoria',
    'requires_access',
    'likes',
    'respostas',
  ] as const

  const updates: string[] = []
  const values: unknown[] = []

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      updates.push(`${key} = ?`)
      values.push(key === 'requires_access' ? (toBoolean(fields[key]) ? 1 : 0) : fields[key])
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'Nenhum campo para atualizar' })
  }

  values.push(id)

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE topico_forum SET ${updates.join(', ')} WHERE id = ?`,
    values,
  )

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Tópico não encontrado' })
  }

  const [rows] = await pool.query<TopicoRow[]>(
    'SELECT * FROM topico_forum WHERE id = ? LIMIT 1',
    [id],
  )

  return res.json(rows[0])
}

export async function deleteTopico(req: Request, res: Response) {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM topico_forum WHERE id = ?',
    [req.params.id],
  )

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Tópico não encontrado' })
  }

  return res.status(204).send()
}
