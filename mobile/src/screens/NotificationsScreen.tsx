import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { apiRequest } from '../services/api'
import { colors } from '../theme/colors'

interface Notificacao {
  id: number
  titulo: string | null
  mensagem: string
  lida: boolean | number
  criada_em: string
}

export function NotificationsScreen() {
  const [itens, setItens] = useState<Notificacao[]>([])
  const [naoLidas, setNaoLidas] = useState(0)
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async () => {
    try {
      const res = await apiRequest<{ notificacoes: Notificacao[]; nao_lidas: number }>(
        '/notificacoes',
      )
      setItens(res.notificacoes ?? [])
      setNaoLidas(Number(res.nao_lidas ?? 0))
    } catch {
      setItens([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  async function marcarTodas() {
    try {
      await apiRequest('/notificacoes/ler-todas', { method: 'PATCH' })
      setItens((prev) => prev.map((n) => ({ ...n, lida: 1 })))
      setNaoLidas(0)
    } catch {
      /* ignora */
    }
  }

  async function marcar(item: Notificacao) {
    if (item.lida) return
    try {
      await apiRequest(`/notificacoes/${item.id}/ler`, { method: 'PATCH' })
      setItens((prev) => prev.map((n) => (n.id === item.id ? { ...n, lida: 1 } : n)))
      setNaoLidas((n) => Math.max(0, n - 1))
    } catch {
      /* ignora */
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.flex}>
      {naoLidas > 0 ? (
        <TouchableOpacity style={styles.marcarTodas} onPress={marcarTodas}>
          <Text style={styles.marcarTodasTexto}>Marcar todas como lidas ({naoLidas})</Text>
        </TouchableOpacity>
      ) : null}

      <FlatList
        contentContainerStyle={{ padding: 12 }}
        data={itens}
        keyExtractor={(n) => String(n.id)}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.muted} />
            <Text style={styles.vazio}>Sem notificações.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const lida = !!item.lida
          return (
            <TouchableOpacity
              style={[styles.card, !lida && styles.cardNova]}
              onPress={() => marcar(item)}
            >
              {!lida ? <View style={styles.ponto} /> : null}
              <View style={styles.flex}>
                {item.titulo ? <Text style={styles.titulo}>{item.titulo}</Text> : null}
                <Text style={styles.mensagem}>{item.mensagem}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  vazio: { color: colors.muted, marginTop: 10 },
  marcarTodas: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  marcarTodasTexto: { color: colors.primary, fontWeight: '700' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 8,
  },
  cardNova: { backgroundColor: '#FFF7F7', borderColor: '#F5D6D6' },
  ponto: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  titulo: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  mensagem: { fontSize: 13, color: colors.muted, lineHeight: 19 },
})
