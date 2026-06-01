import { Bell, Trophy, MessageCircle, ThumbsUp, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'quiz' | 'ranking' | 'topic' | 'like_content' | 'comment_reply' | 'like_comment';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'quiz',
      title: 'Novo Quiz Disponível',
      message: 'Um novo quiz sobre "Economia Angolana Pós-Guerra" está disponível. Teste os seus conhecimentos!',
      time: '5 min atrás',
      read: false,
      icon: <Target className="w-4 h-4" />,
      color: 'bg-blue-500',
    },
    {
      id: '2',
      type: 'ranking',
      title: 'Subiu no Ranking!',
      message: 'Parabéns! Você subiu para a 5ª posição no ranking nacional de quizzes.',
      time: '1 hora atrás',
      read: false,
      icon: <Trophy className="w-4 h-4" />,
      color: 'bg-yellow-500',
    },
    {
      id: '3',
      type: 'topic',
      title: 'Novo Tópico no Fórum',
      message: 'João Silva criou o tópico "Diversificação Económica: Desafios e Oportunidades"',
      time: '2 horas atrás',
      read: false,
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'bg-green-500',
    },
    {
      id: '4',
      type: 'like_content',
      title: 'Gostaram do seu comentário',
      message: 'Maria Costa e mais 3 pessoas gostaram do seu comentário em "Inflação em Angola"',
      time: '3 horas atrás',
      read: true,
      icon: <ThumbsUp className="w-4 h-4" />,
      color: 'bg-red-500',
    },
    {
      id: '5',
      type: 'comment_reply',
      title: 'Resposta ao seu comentário',
      message: 'Carlos Nunes respondeu ao seu comentário no tópico "Petróleo e Economia"',
      time: '5 horas atrás',
      read: true,
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'bg-purple-500',
    },
    {
      id: '6',
      type: 'quiz',
      title: 'Novo Quiz Disponível',
      message: 'Quiz semanal "História Colonial de Angola" já está disponível',
      time: '1 dia atrás',
      read: true,
      icon: <Target className="w-4 h-4" />,
      color: 'bg-blue-500',
    },
    {
      id: '7',
      type: 'ranking',
      title: 'Novo recorde pessoal!',
      message: 'Você atingiu 95% de acertos no último quiz. Continue assim!',
      time: '2 dias atrás',
      read: true,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-yellow-500',
    },
    {
      id: '8',
      type: 'like_comment',
      title: 'Gostaram do seu comentário',
      message: 'Ana Silva gostou do seu comentário sobre "Diversificação Económica"',
      time: '3 dias atrás',
      read: true,
      icon: <ThumbsUp className="w-4 h-4" />,
      color: 'bg-red-500',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header - Cor alterada para #C1121F */}
      <section className="text-white" style={{ background: '#C1121F' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ background: '#C1121F' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Bell className="w-7 h-7" />
                <h1 className="text-3xl font-bold">Notificações</h1>
              </div>
              <p className="text-red-100 text-base">
                Mantenha-se atualizado sobre tudo que acontece na plataforma
              </p>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-white text-red-600 text-base px-3 py-1.5">
                {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Todas as Notificações
          </h2>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="text-red-600 hover:text-red-700 text-sm py-1.5 h-auto"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md cursor-pointer ${
                !notification.read ? 'border-l-4 border-l-red-600 bg-red-50/30' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className={`${notification.color} rounded-full p-2 text-white flex-shrink-0`}>
                    {notification.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-0.5">
                      <h3 className={`text-sm text-slate-900 ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs mb-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-slate-400">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-600 mb-1">
              Nenhuma notificação
            </h3>
            <p className="text-sm text-slate-500">
              Você está em dia! Não há notificações novas.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
