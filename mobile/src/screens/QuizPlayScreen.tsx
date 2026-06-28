import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'

import { apiRequest } from '../services/api'
import { colors } from '../theme/colors'
import type { AppStackParamList } from '../navigation'

type Props = NativeStackScreenProps<AppStackParamList, 'QuizPlay'>

interface Pergunta {
  id: number
  pergunta: string
  opcao_a: string
  opcao_b: string
  opcao_c: string
  opcao_d: string
}
interface Resultado {
  total: number
  acertos: number
  percentual: number
}

export function QuizPlayScreen({ route }: Props) {
  const { id } = route.params
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [respostas, setRespostas] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [aEnviar, setAEnviar] = useState(false)
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    try {
      const data = await apiRequest<{ perguntas: Pergunta[] }>(`/quizzes/${id}`)
      setPerguntas(data.perguntas ?? [])
    } catch {
      setPerguntas([])
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void carregar()
  }, [carregar])

  async function submeter() {
    setErro(null)
    if (Object.keys(respostas).length < perguntas.length) {
      setErro('Responde a todas as perguntas antes de submeter.')
      return
    }
    setAEnviar(true)
    try {
      const payload = {
        respostas: perguntas.map((p) => ({
          pergunta_id: p.id,
          resposta_escolhida: respostas[p.id],
        })),
      }
      const r = await apiRequest<Resultado>(`/quizzes/${id}/attempt`, {
        method: 'POST',
        json: payload,
      })
      setResultado({ total: r.total, acertos: r.acertos, percentual: r.percentual })
    } catch (e) {
      setErro((e as Error).message || 'Não foi possível submeter o quiz.')
    } finally {
      setAEnviar(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (resultado) {
    return (
      <View style={styles.center}>
        <Ionicons
          name={resultado.percentual >= 50 ? 'trophy' : 'ribbon-outline'}
          size={64}
          color={colors.accent}
        />
        <Text style={styles.resTitulo}>Quiz concluído!</Text>
        <Text style={styles.resPercent}>{resultado.percentual}%</Text>
        <Text style={styles.resDetalhe}>
          {resultado.acertos} de {resultado.total} respostas certas
        </Text>
      </View>
    )
  }

  const opcoes = (p: Pergunta) => [
    { valor: 1, texto: p.opcao_a },
    { valor: 2, texto: p.opcao_b },
    { valor: 3, texto: p.opcao_c },
    { valor: 4, texto: p.opcao_d },
  ]

  return (
    <ScrollView style={styles.flex} contentContainerStyle={{ padding: 16 }}>
      {perguntas.length === 0 ? (
        <Text style={styles.vazio}>Este quiz ainda não tem perguntas.</Text>
      ) : (
        perguntas.map((p, idx) => (
          <View key={p.id} style={styles.bloco}>
            <Text style={styles.pergunta}>
              {idx + 1}. {p.pergunta}
            </Text>
            {opcoes(p).map((o) => {
              const escolhida = respostas[p.id] === o.valor
              return (
                <TouchableOpacity
                  key={o.valor}
                  style={[styles.opcao, escolhida && styles.opcaoEscolhida]}
                  onPress={() => setRespostas((prev) => ({ ...prev, [p.id]: o.valor }))}
                >
                  <Ionicons
                    name={escolhida ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={escolhida ? colors.primary : colors.muted}
                  />
                  <Text style={[styles.opcaoTexto, escolhida && styles.opcaoTextoEscolhida]}>
                    {o.texto}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        ))
      )}

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {perguntas.length > 0 ? (
        <TouchableOpacity style={styles.submeter} onPress={submeter} disabled={aEnviar}>
          {aEnviar ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submeterTexto}>Submeter respostas</Text>
          )}
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  vazio: { color: colors.muted, textAlign: 'center', marginTop: 30 },
  bloco: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  pergunta: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 8,
  },
  opcaoEscolhida: { borderColor: colors.primary, backgroundColor: '#FBEAEA' },
  opcaoTexto: { flex: 1, fontSize: 14, color: colors.text },
  opcaoTextoEscolhida: { fontWeight: '700', color: colors.primary },
  erro: { color: colors.danger, textAlign: 'center', marginBottom: 8 },
  submeter: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 30,
  },
  submeterTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resTitulo: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 16 },
  resPercent: { fontSize: 44, fontWeight: '800', color: colors.primary, marginTop: 8 },
  resDetalhe: { fontSize: 15, color: colors.muted, marginTop: 4 },
})
