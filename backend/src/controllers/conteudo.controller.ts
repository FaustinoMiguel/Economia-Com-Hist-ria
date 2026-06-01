import type { Request, Response } from 'express'
import { pool } from '../config/database.js'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'

type ConteudoRow = RowDataPacket & {
  id: number
  titulo: string
  descricao: string | null
  conteudo_completo: string | null
  tipo: 'video' | 'texto_normal' | 'texto_jindungo' | 'podcast'
  categoria: string | null
  tema: string | null
  duracao: string | null
  url_recurso: string | null
  recurso_filename: string | null
  imagem_filename: string | null
  video_filename: string | null
  apresentador: string | null
  categoria_podcast: string | null
  cache_offline: number | 0 | 1
  publicado_por: number | null
  publicado_em: string
}

function toBoolean(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

export async function listConteudos(_req: Request, res: Response) {
  const [rows] = await pool.query<ConteudoRow[]>(
    'SELECT * FROM conteudo ORDER BY publicado_em DESC, id DESC',
  )
  res.json(rows)
}

export async function getConteudoById(req: Request, res: Response) {
  const [rows] = await pool.query<ConteudoRow[]>(
    'SELECT * FROM conteudo WHERE id = ? LIMIT 1',
    [req.params.id],
  )

  const conteudo = rows[0]
  if (!conteudo) {
    return res.status(404).json({ message: 'Conteúdo não encontrado' })
  }

  return res.json(conteudo)
}

export async function createConteudo(req: Request, res: Response) {
  const {
    titulo,
    descricao = null,
    conteudo_completo = null,
    tipo,
    categoria = null,
    tema = null,
    duracao = null,
    url_recurso = null,
    recurso_filename = null,
    imagem_filename = null,
    video_filename = null,
    apresentador = null,
    categoria_podcast = null,
    cache_offline = false,
    publicado_por = null,
  } = req.body ?? {}

  if (!titulo || !tipo) {
    return res.status(400).json({ message: 'titulo e tipo são obrigatórios' })
  }

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO conteudo
      (titulo, descricao, conteudo_completo, tipo, categoria, tema, duracao, url_recurso,
       recurso_filename, imagem_filename, video_filename, apresentador, categoria_podcast,
       cache_offline, publicado_por)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      titulo,
      descricao,
      conteudo_completo,
      tipo,
      categoria,
      tema,
      duracao,
      url_recurso,
      recurso_filename,
      imagem_filename,
      video_filename,
      apresentador,
      categoria_podcast,
      toBoolean(cache_offline) ? 1 : 0,
      publicado_por,
    ],
  )

  const [rows] = await pool.query<ConteudoRow[]>(
    'SELECT * FROM conteudo WHERE id = ? LIMIT 1',
    [result.insertId],
  )

  return res.status(201).json(rows[0])
}

export async function updateConteudo(req: Request, res: Response) {
  const id = req.params.id
  const fields = req.body ?? {}

  const allowedFields = [
    'titulo',
    'descricao',
    'conteudo_completo',
    'tipo',
    'categoria',
    'tema',
    'duracao',
    'url_recurso',
    'recurso_filename',
    'imagem_filename',
    'video_filename',
    'apresentador',
    'categoria_podcast',
    'cache_offline',
    'publicado_por',
  ] as const

  const updates: string[] = []
  const values: unknown[] = []

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      updates.push(`${key} = ?`)
      values.push(key === 'cache_offline' ? (toBoolean(fields[key]) ? 1 : 0) : fields[key])
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'Nenhum campo para atualizar' })
  }

  values.push(id)

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE conteudo SET ${updates.join(', ')} WHERE id = ?`,
    values,
  )

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Conteúdo não encontrado' })
  }

  const [rows] = await pool.query<ConteudoRow[]>(
    'SELECT * FROM conteudo WHERE id = ? LIMIT 1',
    [id],
  )

  return res.json(rows[0])
}

export async function deleteConteudo(req: Request, res: Response) {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM conteudo WHERE id = ?',
    [req.params.id],
  )

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Conteúdo não encontrado' })
  }

  return res.status(204).send()
}
