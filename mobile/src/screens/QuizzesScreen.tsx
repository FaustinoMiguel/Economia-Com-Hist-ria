import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'

import { apiRequest } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { colors } from '../theme/colors'
import type { AppStackParamList } from '../navigation'

interface Quiz {
  id: number
  titulo: string
  descricao: string | null
  categoria: string | null
}
interface RankingRow {
  id: number
  nome: string
  provincia: string | null
  pontuacao_total: number
  quizzes_completados: number
}

export function QuizzesScreen() {
  const { isAuthenticated } = useAuth()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [ranking, setRanking] = useState<RankingRow[]>([])
  const [loading, setLoading] = useState(true)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const [qs, rk] = await Promise.all([
        apiRequest<any[]>('/quizzes', { anonymous: true }).catch(() => []),
        apiRequest<any[]>('/ranking').catch(() => []),
      ])
      setQuizzes((qs ?? []).map((q) => ({
        id: Number(q.id),
        titulo: q.titulo,
        descricao: q.descricao,
        categoria: q.categoria,
      })))
      setRanking((rk ?? []).map((r) => ({
        id: Number(r.id),
        nome: r.nome,
        provincia: r.provincia,
        pontuacao_total: Number(r.pontuacao_total ?? 0),
        quizzes_completados: Number(r.quizzes_completados ?? 0),
      })))
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void carregar()
    }, [carregar]),
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.seccao}>Quizzes disponíveis</Text>
      {quizzes.length === 0 ? (
        <Text style={styles.vazio}>Ainda não há quizzes.</Text>
      ) : (
        quizzes.map((q) => (
          <TouchableOpacity
            key={q.id}
            style={styles.card}
            onPress={() =>
              isAuthenticated
                ? navigation.navigate('QuizPlay', { id: q.id, titulo: q.titulo })
                : navigation.navigate('Login')
            }
          >
            <View style={styles.iconeQuiz}>
              <Ionicons name="help-circle" size={22} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.cardTitulo}>{q.titulo}</Text>
              {q.descricao ? (
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {q.descricao}
                </Text>
              ) : null}
              {q.categoria ? <Text style={styles.cardCat}>{q.categoria}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        ))
      )}

      <Text style={[styles.seccao, { marginTop: 24 }]}>Ranking</Text>
      {ranking.length === 0 ? (
        <Text style={styles.vazio}>Ainda não há classificações.</Text>
      ) : (
        ranking.map((r, i) => (
          <View key={r.id} style={styles.rankRow}>
            <Text style={[styles.rankPos, i < 3 && { color: colors.primary }]}>{i + 1}</Text>
            <View style={styles.flex}>
              <Text style={styles.rankNome}>{r.nome}</Text>
              <Text style={styles.rankMeta}>
                {r.quizzes_completados} quizzes · {r.provincia ?? '—'}
              </Text>
            </View>
            <Text style={styles.rankPontos}>{r.pontuacao_total} pts</Text>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  vazio: { color: colors.muted, marginTop: 8 },
  seccao: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  iconeQuiz: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FBEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardDesc: { fontSize: 13, color: colors.muted, marginTop: 3 },
  cardCat: { fontSize: 11, color: colors.primary, marginTop: 5, fontWeight: '600' },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  rankPos: { fontSize: 16, fontWeight: '800', color: colors.muted, width: 24, textAlign: 'center' },
  rankNome: { fontSize: 14, fontWeight: '700', color: colors.text },
  rankMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  rankPontos: { fontSize: 14, fontWeight: '800', color: colors.accent },
})
