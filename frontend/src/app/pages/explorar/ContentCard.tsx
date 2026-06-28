import React from 'react'
import { motion } from 'motion/react'
import {
  Video, Mic, FileText, Play, Headphones, BookOpen, Lock, Edit3, Trash2, RefreshCcw, Bookmark,
} from 'lucide-react'
import type { Content, AccessRequestInfo, AccessRequestStatus } from './types'
import { AccessStatusPanel } from './StatusPanels'

interface ContentCardProps {
  content: Content
  isSaved: boolean
  isSavingId: string | null
  isCreator: boolean
  accessInfo: AccessRequestInfo | undefined
  isPremiumContent: boolean
  canOpenPremiumContent: boolean
  categoryLabels: Record<string, { label: string; icon: any; color: string }>
  onOpen: (content: Content) => void
  onSaveToggle: (id: string, title: string) => void
  onAccessRequest: (content: Content) => void
  onEditStart: (content: Content) => void
  onDeleteStart: (id: string) => void
  getAccessInfo: (contentId: string) => AccessRequestInfo | undefined
  getAccessStatusLabel: (status?: AccessRequestStatus) => string
  formatDateTime: (value?: string | null) => string
}

export function ContentCard({
  content,
  isSaved,
  isSavingId,
  isCreator,
  accessInfo,
  isPremiumContent,
  canOpenPremiumContent,
  categoryLabels,
  onOpen,
  onSaveToggle,
  onAccessRequest,
  onEditStart,
  onDeleteStart,
  getAccessInfo,
  getAccessStatusLabel,
  formatDateTime,
}: ContentCardProps) {
  return (
    <article className="bg-white rounded-2xl border border-[#800020]/10 shadow-xs hover:border-[#800020]/25 hover:shadow-xl hover:shadow-[#800020]/[0.06] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col group">

      {/* Thumbnail / capa */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        {content.thumbnail ? (
          <img
            src={content.thumbnail}
            alt={`Capa de ${content.title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${content.imageColor} flex items-center justify-center`}>
            {content.imageIcon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Badge tipo */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase text-white bg-slate-950/80 backdrop-blur-xs">
            {content.type === 'video'           && <Video    className="w-3 h-3 text-red-500"     />}
            {content.type === 'podcast'         && <Mic      className="w-3 h-3 text-purple-500"  />}
            {content.type === 'texto_normal'    && <FileText className="w-3 h-3 text-emerald-500" />}
            {content.type === 'texto_jindungo'  && <FileText className="w-3 h-3 text-emerald-500" />}
            <span>
              {content.type === 'video'          && 'Vídeo'}
              {content.type === 'podcast'        && 'Podcast'}
              {content.type === 'texto_normal'   && 'Texto'}
              {content.type === 'texto_jindungo' && 'TEXTO COM JINDUNGO'}
            </span>
          </span>
        </div>

        {/* Botão guardar */}
        <motion.button
          onClick={() => onSaveToggle(content.id, content.title)}
          aria-label={isSaved ? `Remover ${content.title} dos favoritos` : `Adicionar ${content.title} aos favoritos`}
          whileTap={{ scale: 0.92 }}
          animate={isSavingId === content.id ? { scale: [1, 1.16, 1] } : { scale: isSaved ? 1.1 : 1 }}
          transition={{ duration: 0.28 }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-all ${
            isSaved
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
              : 'bg-slate-900/40 text-white hover:bg-slate-900/60'
          }`}
        >
          <motion.span
            className="relative flex"
            animate={isSaved ? { rotate: [0, -8, 6, 0] } : { rotate: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved && (
              <motion.span
                className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.span>
        </motion.button>
      </div>

      {/* Corpo do cartão */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Categorias */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {content.category.map((catKey) => (
              <span
                key={catKey}
                className="text-[10px] uppercase tracking-wider font-extrabold text-[#264653] bg-[#264653]/[0.07] py-0.5 px-2 rounded-md"
              >
                {categoryLabels[catKey]?.label || catKey}
              </span>
            ))}
          </div>

          <h4 className="text-lg font-bold text-slate-950 line-clamp-2 leading-snug group-hover:text-[#800020] transition-colors">
            {content.title}
          </h4>
          <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Autor */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#800020]/10 text-[#800020] font-bold text-xs flex items-center justify-center">
              {content.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{content.author}</p>
              <p className="text-[9px] text-slate-400 font-medium">
                {content.date}{content.type !== 'video' && content.type !== 'podcast' && content.duration && ` · ${content.duration}`}
              </p>
            </div>
          </div>
        </div>

        {/* Acções */}
        <div className="mt-5">
          {isPremiumContent ? (
            accessInfo ? (
              <div className="space-y-2">
                <AccessStatusPanel
                  content={content}
                  compact
                  getAccessInfo={getAccessInfo}
                  getAccessStatusLabel={getAccessStatusLabel}
                  formatDateTime={formatDateTime}
                />
                {canOpenPremiumContent ? (
                  <button
                    onClick={() => onOpen(content)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#800020] text-white hover:bg-[#5C0016] font-bold text-xs transition-colors shadow-xs"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Ler conteúdo aprovado</span>
                  </button>
                ) : accessInfo.status === 'rejeitado' ? (
                  <button
                    onClick={() => onAccessRequest(content)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white border border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" />
                    <span>Solicitar novamente</span>
                  </button>
                ) : null}
              </div>
            ) : (
              <button
                onClick={() => onAccessRequest(content)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#800020] text-white hover:bg-[#5C0016] font-bold text-xs transition-colors shadow-xs"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Solicitar Acesso</span>
              </button>
            )
          ) : (
            <button
              onClick={() => onOpen(content)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#800020] text-white hover:bg-[#5C0016] font-bold text-xs transition-transform transform hover:-translate-y-0.5 active:translate-y-0 shadow-xs group-hover:shadow-md"
            >
              {content.type === 'video'        && <Play      className="w-3.5 h-3.5 fill-current" />}
              {content.type === 'podcast'      && <Headphones className="w-3.5 h-3.5" />}
              {content.type === 'texto_normal' && <BookOpen   className="w-3.5 h-3.5" />}
              <span>
                {content.type === 'video'        && 'Assistir Agora'}
                {content.type === 'podcast'      && 'Ouvir Podcast'}
                {content.type === 'texto_normal' && 'Ler Agora'}
              </span>
            </button>
          )}

          {/* Acções de gestão (criador / professor / admin) */}
          {isCreator && (
            <div className="mt-2.5 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400">
              <button
                onClick={() => onEditStart(content)}
                className="flex items-center gap-1 hover:text-orange-600 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>Editar</span>
              </button>
              <span>·</span>
              <button
                onClick={() => onDeleteStart(content.id)}
                className="flex items-center gap-1 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Apagar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
