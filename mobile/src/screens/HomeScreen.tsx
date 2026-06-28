import React, { useCallback, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'

import { apiRequest } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { colors } from '../theme/colors'
import type { AppStackParamList } from '../navigation'

interface Stats {
  total_conteudos: number
  total_perguntas_quiz: number
  total_topicos: number
  total_utilizadores: number
}

const FALLBACK: Stats = {
  total_conteudos: 0,
  total_perguntas_quiz: 0,
  total_topicos: 0,
  total_utilizadores: 0,
}

export function HomeScreen() {
  const { user, isAuthenticated } = useAuth()
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const [stats, setStats] = useState<Stats | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const carregar = useCallback(async () => {
    try {
      const data = await apiRequest<Stats>('/stats', { anonymous: true })
      setStats(data)
    } catch {
      setStats(FALLBACK)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void carregar()
    }, [carregar]),
  )

  const s = stats ?? FALLBACK
  const cards = [
    { label: 'Conteúdos', value: s.total_conteudos, icon: 'book' as const },
    { label: 'Questões de Quiz', value: s.total_perguntas_quiz, icon: 'help-circle' as const },
    { label: 'Debates', value: s.total_topicos, icon: 'chatbubbles' as const },
    { label: 'Membros', value: s.total_utilizadores, icon: 'people' as const },
  ]

  return (
    <ScrollView
      style={styles.flex}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            await carregar()
            setRefreshing(false)
          }}
        />
      }
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.ola}>Olá, {user?.name?.split(' ')[0] ?? 'visitante'} 👋</Text>
          {isAuthenticated ? (
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.entrarBtn} onPress={() => navigation.navigate('Login')}>
              <Ionicons name="log-in-outline" size={16} color={colors.primary} />
              <Text style={styles.entrarTexto}>Entrar</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.heroTitulo}>Economia com História</Text>
        <Text style={styles.heroSub}>Explora a economia e a história de Angola</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((c) => (
          <View key={c.label} style={styles.card}>
            <Ionicons name={c.icon} size={22} color={colors.primary} />
            <Text style={styles.cardValor}>{stats ? c.value : '—'}</Text>
            <Text style={styles.cardLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>A nossa missão</Text>
        <Text style={styles.secaoTexto}>
          Unir história e economia angolana numa narrativa coerente, desenvolver pensamento
          crítico e criar espaços de debate sobre temas relevantes para Angola.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  hero: { backgroundColor: colors.primary, padding: 24, paddingTop: 28 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ola: { color: '#fff', fontSize: 15, opacity: 0.95 },
  entrarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  entrarTexto: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  heroTitulo: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 14 },
  heroSub: { color: '#fff', opacity: 0.9, marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    width: '47%',
    flexGrow: 1,
  },
  cardValor: { fontSize: 26, fontWeight: '800', color: colors.text, marginTop: 8 },
  cardLabel: { fontSize: 13, color: colors.muted, marginTop: 2 },
  secao: { padding: 20 },
  secaoTitulo: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  secaoTexto: { fontSize: 14, color: colors.muted, lineHeight: 21 },
})
