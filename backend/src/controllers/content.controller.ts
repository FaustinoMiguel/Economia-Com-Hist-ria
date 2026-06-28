import { Request, Response } from 'express'
import * as ContentModel from '../models/content.model.js'

export async function listarConteudos(req: Request, res: Response): Promise<void> {
  try {
    const conteudos = await ContentModel.findAllConteudos()
    res.status(200).json({ conteudos })
  } catch (error) {
    console.error('Erro ao listar conteúdos:', error)
    res.status(500).json({ erro: 'Erro interno ao obter conteúdos.' })
  }
}

const TIPOS_VALIDOS = ['video', 'texto_normal', 'texto_jindungo', 'podcast']

export async function criarConteudo(req: Request, res: Response): Promise<void> {
  try {
    const {
      titulo, descricao, conteudo_completo, tipo, categoria,
      duracao, url_recurso, apresentador, categoria_podcast,
    } = req.body ?? {}

    if (!titulo?.trim() || !tipo) {
      res.status(400).json({ erro: 'titulo e tipo são obrigatórios.' })
      return
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      res.status(400).json({ erro: 'tipo inválido.' })
      return
    }

    const conteudo = await ContentModel.createConteudo({
      titulo: titulo.trim(),
      descricao: descricao ?? null,
      conteudo_completo: conteudo_completo ?? null,
      tipo,
      categoria: categoria ?? null,
      duracao: duracao ?? null,
      url_recurso: url_recurso ?? null,
      apresentador: apresentador ?? null,
      categoria_podcast: categoria_podcast ?? null,
      publicado_por: req.user!.userId,
    })

    res.status(201).json({ conteudo })
  } catch (error) {
    console.error('Erro ao criar conteúdo:', error)
    res.status(500).json({ erro: 'Erro interno ao criar conteúdo.' })
  }
}

export async function atualizarConteudo(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(String(req.params.id))
    if (isNaN(id)) {
      res.status(400).json({ erro: 'ID inválido.' })
      return
    }
    if (req.body?.tipo && !TIPOS_VALIDOS.includes(req.body.tipo)) {
      res.status(400).json({ erro: 'tipo inválido.' })
      return
    }
    const conteudo = await ContentModel.updateConteudo(id, req.body ?? {})
    if (!conteudo) {
      res.status(404).json({ erro: 'Conteúdo não encontrado.' })
      return
    }
    res.status(200).json({ conteudo })
  } catch (error) {
    console.error('Erro ao atualizar conteúdo:', error)
    res.status(500).json({ erro: 'Erro interno ao atualizar conteúdo.' })
  }
}

export async function removerConteudo(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(String(req.params.id))
    if (isNaN(id)) {
      res.status(400).json({ erro: 'ID inválido.' })
      return
    }
    const isAdmin = req.user!.role === 'admin' || req.user!.role === 'superadmin'
    const sucesso = await ContentModel.deleteConteudo(id, req.user!.userId, isAdmin)
    if (!sucesso) {
      res.status(404).json({ erro: 'Conteúdo não encontrado ou sem permissão.' })
      return
    }
    res.status(200).json({ sucesso: true })
  } catch (error) {
    console.error('Erro ao remover conteúdo:', error)
    res.status(500).json({ erro: 'Erro interno ao remover conteúdo.' })
  }
}

export async function obterEstadoUsuario(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.user!.userId
    const estado = await ContentModel.getEstadoConteudosUsuario(usuarioId)
    const toIso = (value: any) => value ? new Date(value).toISOString() : null

    res.status(200).json({
      likedContents: Object.fromEntries(
        estado.reacoes
          .filter((row: any) => row.tipo === 'like')
          .map((row: any) => [String(row.conteudo_id), true])
      ),
      dislikedContents: Object.fromEntries(
        estado.reacoes
          .filter((row: any) => row.tipo === 'dislike')
          .map((row: any) => [String(row.conteudo_id), true])
      ),
      savedContents: Object.fromEntries(
        estado.salvos.map((row: any) => [String(row.conteudo_id), true])
      ),
      accessRequested: Object.fromEntries(
        estado.acessos
          .filter((row: any) => row.status === 'pendente' || row.status === 'aprovado' || row.status === 'rejeitado')
          .map((row: any) => [
            String(row.conteudo_id),
            {
              status: row.status,
              requestedAt: toIso(row.solicitado_em),
              reviewedAt: toIso(row.respondido_em),
              reviewedBy: row.admin_nome || null,
              notes: row.observacoes_resposta || null,
            },
          ])
      ),
      reportedContents: Object.fromEntries(
        estado.denuncias.map((row: any) => [
          String(row.conteudo_id),
          {
            status: row.status,
            reportedAt: toIso(row.criada_em),
            reviewedAt: toIso(row.resolvido_em),
            reviewedBy: row.admin_nome || null,
            notes: row.observacoes_moderacao || null,
          },
        ])
      ),
    })
  } catch (error) {
    console.error('Erro ao obter estado do utilizador:', error)
    res.status(500).json({ erro: 'Erro interno ao obter estado do utilizador.' })
  }
}

export async function denunciarConteudo(req: Request, res: Response): Promise<void> {
  try {
    const conteudoId = parseInt(String(req.params.id))
    const { motivo, descricao } = req.body as { motivo?: string; descricao?: string }
    const motivoLimpo = motivo?.trim()

    if (isNaN(conteudoId) || !motivoLimpo) {
      res.status(400).json({ erro: 'Denúncia inválida.' })
      return
    }

    await ContentModel.criarDenunciaConteudo(
      conteudoId,
      req.user!.userId,
      motivoLimpo,
      descricao?.trim() || null
    )
    res.status(201).json({
      sucesso: true,
      report: {
        status: 'pendente',
        reportedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        notes: null,
      },
    })
  } catch (error) {
    console.error('Erro ao denunciar conteúdo:', error)
    res.status(500).json({ erro: 'Erro interno ao denunciar conteúdo.' })
  }
}

export async function solicitarAcessoConteudo(req: Request, res: Response): Promise<void> {
  try {
    const conteudoId = parseInt(String(req.params.id))
    const { motivo } = req.body as { motivo?: string }

    if (isNaN(conteudoId)) {
      res.status(400).json({ erro: 'Pedido de acesso inválido.' })
      return
    }

    await ContentModel.criarSolicitacaoAcesso(conteudoId, req.user!.userId, motivo?.trim() || null)
    res.status(201).json({
      sucesso: true,
      accessRequest: {
        status: 'pendente',
        requestedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null,
        notes: null,
      },
    })
  } catch (error) {
    console.error('Erro ao solicitar acesso:', error)
    res.status(500).json({ erro: 'Erro interno ao solicitar acesso.' })
  }
}

export async function registrarVisualizacao(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const conteudoId = parseInt(String(id))
    
    if (isNaN(conteudoId)) {
      res.status(400).json({ erro: 'ID de conteúdo inválido' })
      return
    }

    const sucesso = await ContentModel.incrementarVisualizacoes(conteudoId)
    if (!sucesso) {
      res.status(404).json({ erro: 'Conteúdo não encontrado' })
      return
    }

    res.status(200).json({ sucesso: true, mensagem: 'Visualização registrada' })
  } catch (error) {
    console.error('Erro ao registrar visualização:', error)
    res.status(500).json({ erro: 'Erro interno ao registrar visualização.' })
  }
}

export async function reagirConteudo(req: Request, res: Response): Promise<void> {
  try {
    const conteudoId = parseInt(String(req.params.id))
    const { tipo } = req.body as { tipo?: 'like' | 'dislike' | null }

    if (isNaN(conteudoId) || !['like', 'dislike', null].includes(tipo ?? null)) {
      res.status(400).json({ erro: 'Pedido de reação inválido.' })
      return
    }

    const contadores = await ContentModel.setConteudoReacao(conteudoId, req.user!.userId, tipo ?? null)
    res.status(200).json({ sucesso: true, tipo: tipo ?? null, ...contadores })
  } catch (error) {
    console.error('Erro ao reagir ao conteúdo:', error)
    res.status(500).json({ erro: 'Erro interno ao reagir ao conteúdo.' })
  }
}

export async function guardarConteudo(req: Request, res: Response): Promise<void> {
  try {
    const conteudoId = parseInt(String(req.params.id))
    const { saved } = req.body as { saved?: boolean }

    if (isNaN(conteudoId) || typeof saved !== 'boolean') {
      res.status(400).json({ erro: 'Pedido de favorito inválido.' })
      return
    }

    await ContentModel.toggleConteudoSalvo(conteudoId, req.user!.userId, saved)
    res.status(200).json({ sucesso: true, saved })
  } catch (error) {
    console.error('Erro ao guardar conteúdo:', error)
    res.status(500).json({ erro: 'Erro interno ao guardar conteúdo.' })
  }
}

function mapComentarios(rows: ContentModel.ComentarioConteudoRow[], currentUserId?: number) {
  const byId = new Map<number, any>()
  const roots: any[] = []

  rows.forEach((row) => {
    const initials = row.autor_nome
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()

    byId.set(row.id, {
      id: String(row.id),
      author: row.autor_nome,
      avatar: initials || 'U',
      text: row.comentario,
      time: row.publicado_em,
      likes: row.likes || 0,
      replies: [],
      createdByCurrentUser: currentUserId === row.autor_id,
      likedByCurrentUser: Boolean(row.liked_by_current_user),
    })
  })

  rows.forEach((row) => {
    const comment = byId.get(row.id)
    if (row.comentario_pai_id && byId.has(row.comentario_pai_id)) {
      byId.get(row.comentario_pai_id).replies.push(comment)
    } else {
      roots.push(comment)
    }
  })

  return roots.reverse()
}

export async function listarComentarios(req: Request, res: Response): Promise<void> {
  try {
    const conteudoId = parseInt(String(req.params.id))
    if (isNaN(conteudoId)) {
      res.status(400).json({ erro: 'ID de conteúdo inválido.' })
      return
    }

    const rows = await ContentModel.findComentariosConteudo(conteudoId, req.user?.userId)
    res.status(200).json({ comentarios: mapComentarios(rows, req.user?.userId) })
  } catch (error) {
    console.error('Erro ao listar comentários:', error)
    res.status(500).json({ erro: 'Erro interno ao listar comentários.' })
  }
}

export async function criarComentario(req: Request, res: Response): Promise<void> {
  try {
    const conteudoId = parseInt(String(req.params.id))
    const { comentario, comentarioPaiId } = req.body as { comentario?: string; comentarioPaiId?: string | null }
    const texto = comentario?.trim()

    if (isNaN(conteudoId) || !texto) {
      res.status(400).json({ erro: 'Comentário inválido.' })
      return
    }

    await ContentModel.createComentarioConteudo(
      conteudoId,
      req.user!.userId,
      texto,
      comentarioPaiId ? parseInt(comentarioPaiId) : null
    )
    const rows = await ContentModel.findComentariosConteudo(conteudoId, req.user!.userId)
    res.status(201).json({ comentarios: mapComentarios(rows, req.user!.userId) })
  } catch (error) {
    console.error('Erro ao criar comentário:', error)
    res.status(500).json({ erro: 'Erro interno ao criar comentário.' })
  }
}

export async function atualizarComentario(req: Request, res: Response): Promise<void> {
  try {
    const comentarioId = parseInt(String(req.params.commentId))
    const { comentario } = req.body as { comentario?: string }
    const texto = comentario?.trim()

    if (isNaN(comentarioId) || !texto) {
      res.status(400).json({ erro: 'Comentário inválido.' })
      return
    }

    const sucesso = await ContentModel.updateComentarioConteudo(comentarioId, req.user!.userId, texto)
    if (!sucesso) {
      res.status(404).json({ erro: 'Comentário não encontrado ou sem permissão.' })
      return
    }

    res.status(200).json({ sucesso: true })
  } catch (error) {
    console.error('Erro ao atualizar comentário:', error)
    res.status(500).json({ erro: 'Erro interno ao atualizar comentário.' })
  }
}

export async function removerComentario(req: Request, res: Response): Promise<void> {
  try {
    const comentarioId = parseInt(String(req.params.commentId))
    if (isNaN(comentarioId)) {
      res.status(400).json({ erro: 'ID de comentário inválido.' })
      return
    }

    const sucesso = await ContentModel.deleteComentarioConteudo(
      comentarioId,
      req.user!.userId,
      (req.user!.role === 'admin' || req.user!.role === 'superadmin')
    )
    if (!sucesso) {
      res.status(404).json({ erro: 'Comentário não encontrado ou sem permissão.' })
      return
    }

    res.status(200).json({ sucesso: true })
  } catch (error) {
    console.error('Erro ao remover comentário:', error)
    res.status(500).json({ erro: 'Erro interno ao remover comentário.' })
  }
}

export async function gostarComentario(req: Request, res: Response): Promise<void> {
  try {
    const comentarioId = parseInt(String(req.params.commentId))
    const { liked } = req.body as { liked?: boolean }

    if (isNaN(comentarioId) || typeof liked !== 'boolean') {
      res.status(400).json({ erro: 'Pedido de like inválido.' })
      return
    }

    const likes = await ContentModel.toggleComentarioLike(comentarioId, req.user!.userId, liked)
    res.status(200).json({ sucesso: true, liked, likes })
  } catch (error) {
    console.error('Erro ao gostar de comentário:', error)
    res.status(500).json({ erro: 'Erro interno ao gostar de comentário.' })
  }
}

export async function listarPlaylist(req: Request, res: Response): Promise<void> {
  try {
    const rows = await ContentModel.getPlaylistUsuario(req.user!.userId)
    const playlistItems = Object.fromEntries(rows.map((row) => [
      `${row.conteudo_id}_${row.episodio_id}`,
      {
        episodeId: row.episodio_id,
        podcastContentId: String(row.conteudo_id),
        episodeTitle: row.episodio_titulo,
        podcastTitle: row.podcast_titulo,
        duration: row.duracao || '',
        date: row.data_publicacao || '',
        podcastAuthor: row.autor || 'Economia com História',
        podcastThumbnail: row.thumbnail_url || undefined,
        audioUrl: row.audio_url || undefined,
        addedAt: new Date(row.adicionado_em).getTime(),
      },
    ]))
    res.status(200).json({ playlistItems })
  } catch (error) {
    console.error('Erro ao listar playlist:', error)
    res.status(500).json({ erro: 'Erro interno ao listar playlist.' })
  }
}

export async function adicionarPlaylist(req: Request, res: Response): Promise<void> {
  try {
    const {
      podcastContentId,
      episodeId,
      episodeTitle,
      podcastTitle,
      duration,
      date,
      podcastAuthor,
      podcastThumbnail,
      audioUrl,
    } = req.body

    const conteudoId = parseInt(podcastContentId)
    if (isNaN(conteudoId) || !episodeId || !episodeTitle || !podcastTitle) {
      res.status(400).json({ erro: 'Item de playlist inválido.' })
      return
    }

    await ContentModel.addPlaylistItem(req.user!.userId, {
      conteudoId,
      episodioId: String(episodeId),
      episodioTitulo: episodeTitle,
      podcastTitulo: podcastTitle,
      duracao: duration,
      dataPublicacao: date,
      autor: podcastAuthor,
      thumbnailUrl: podcastThumbnail,
      audioUrl,
    })
    res.status(201).json({ sucesso: true })
  } catch (error) {
    console.error('Erro ao adicionar à playlist:', error)
    res.status(500).json({ erro: 'Erro interno ao adicionar à playlist.' })
  }
}

export async function removerPlaylist(req: Request, res: Response): Promise<void> {
  try {
    const conteudoId = parseInt(String(req.params.contentId))
    const episodioId = String(req.params.episodeId)
    if (isNaN(conteudoId) || !episodioId) {
      res.status(400).json({ erro: 'Item de playlist inválido.' })
      return
    }

    await ContentModel.removePlaylistItem(req.user!.userId, conteudoId, episodioId)
    res.status(200).json({ sucesso: true })
  } catch (error) {
    console.error('Erro ao remover da playlist:', error)
    res.status(500).json({ erro: 'Erro interno ao remover da playlist.' })
  }
}
