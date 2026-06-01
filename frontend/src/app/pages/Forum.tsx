import { useState } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Send, Search, Lock, Plus, MoreVertical, X, Image as ImageIcon, Flag, Share2, Bookmark, Globe, Users, TrendingUp, Clock, ChevronDown, ChevronUp, Eye, EyeOff, AlertCircle, Flame, Award, Zap, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import AuthPrompt from '../components/AuthPrompt';

interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  timeAgo: string;
  content: string;
  likes: number;
  replies?: Comment[];
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  date: string;
  category: string;
  categoryType: 'public' | 'private';
  excerpt: string;
  fullContent?: string;
  previewContent?: string;
  replies: number;
  likes: number;
  isPrivate?: boolean;
  timeAgo?: string;
  comments?: Comment[];
  requiresAccess?: boolean;
}

export default function Forum() {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [newPost, setNewPost] = useState({ title: '', content: '', isPrivate: false, image: null as File | null });
  const [activeTab, setActiveTab] = useState<string>('discussions');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authAction, setAuthAction] = useState('realizar esta ação');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [commentsExpanded, setCommentsExpanded] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ comment: Comment; discussionId: string } | null>(null);
  const [commentsLiked, setCommentsLiked] = useState<Set<string>>(new Set());
  const [accessRequested, setAccessRequested] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(5);
  const [replyText, setReplyText] = useState('');
  
  // Sidebar dropdown states
  const [popularTopicsOpen, setPopularTopicsOpen] = useState(true);
  const [recentDiscussionsOpen, setRecentDiscussionsOpen] = useState(true);
  const [unansweredOpen, setUnansweredOpen] = useState(true);
  
  // Modal states
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionModalType, setActionModalType] = useState<'report' | 'share' | 'save' | 'comment_report'>('report');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const discussions: Discussion[] = [
    {
      id: '1',
      title: 'Exportação de petróleo: dependência económica',
      author: 'Joel Carlos M.',
      authorInitials: 'JM',
      date: '20 Mar 2026',
      timeAgo: 'há 2 minutos',
      category: 'Economia Actual',
      categoryType: 'public',
      excerpt: 'Angola continua altamente dependente das exportações de petróleo, que representam cerca de 95% das receitas de exportação...',
      fullContent: 'Angola continua altamente dependente das exportações de petróleo, que representam cerca de 95% das receitas de exportação e mais de 70% das receitas fiscais do governo. Esta dependência torna a economia angolana extremamente vulnerável às flutuações dos preços internacionais do petróleo. Quando os preços caem, como aconteceu em 2014-2016 e mais recentemente em 2020, o país enfrenta graves crises económicas, com desvalorização da moeda, aumento da dívida pública e cortes nos gastos sociais. A diversificação económica é apontada como solução, mas requer investimentos significativos em infraestrutura, educação e políticas públicas consistentes para desenvolver setores como agricultura, indústria transformadora e turismo.',
      replies: 24,
      likes: 124,
      isPrivate: false,
      requiresAccess: false,
      comments: [
        {
          id: 'c1',
          author: 'Maria Santos',
          authorInitials: 'MS',
          timeAgo: '1h atrás',
          content: 'Concordo plenamente! A dependência do petróleo é um dos maiores desafios que Angola enfrenta. Precisamos diversificar urgentemente.',
          likes: 12,
          replies: []
        },
        {
          id: 'c2',
          author: 'Pedro Lima',
          authorInitials: 'PL',
          timeAgo: '45min atrás',
          content: 'Exatamente! O setor agrícola tem muito potencial ainda por explorar.',
          likes: 5,
          replies: []
        },
        {
          id: 'c3',
          author: 'Carlos Nunes',
          authorInitials: 'CN',
          timeAgo: '2h atrás',
          content: 'Alguém tem dados sobre a percentagem atual das exportações não-petrolíferas?',
          likes: 8,
          replies: []
        }
      ]
    },
    {
      id: '2',
      title: 'O Caminho do Ferro de Benguela e a Carreação do Lobito',
      author: 'Jor Manuel K.',
      authorInitials: 'JK',
      date: '18 Mar 2026',
      timeAgo: 'há 1 hora',
      category: 'Sociedade',
      categoryType: 'private',
      excerpt: 'O Caminho de Ferro de Benguela (CFB) foi uma das infraestruturas mais importantes da África Austral...',
      fullContent: 'O Caminho de Ferro de Benguela (CFB) foi uma das infraestruturas mais importantes da África Austral, ligando o porto do Lobito, em Angola, à província mineralógica do Katanga, na atual República Democrática do Congo. Construído entre 1902 e 1929, o CFB desempenhou um papel crucial no comércio regional, escoando cobre, cobalto e outros minerais. Durante a guerra civil angolana (1975-2002), o caminho de ferro foi severamente danificado e ficou inoperante. Após a guerra, iniciou-se um processo de reabilitação que culminou com a reabertura em 2015. O Corredor do Lobito, que inclui o CFB, é agora uma das principais prioridades de investimento internacional, incluindo parcerias com os Estados Unidos e a União Europeia.',
      replies: 2,
      likes: 12,
      isPrivate: true,
      requiresAccess: true,
      previewContent: '[Conteúdo privado - solicite acesso para ler mais]',
      comments: [
        {
          id: 'c4',
          author: 'Ana Silva',
          authorInitials: 'AS',
          timeAgo: '3h atrás',
          content: 'Excelente tópico! O CFB é realmente uma infraestrutura estratégica para a região.',
          likes: 3,
          replies: []
        }
      ]
    },
    {
      id: '3',
      title: 'O Ciclo do Café: Do auge à diversificação',
      author: 'Joel Carlos M.',
      authorInitials: 'JM',
      date: '15 Mar 2026',
      timeAgo: 'há 30 minutos',
      category: 'História Económica',
      categoryType: 'public',
      excerpt: 'Entre as décadas de 1960 e 1970, Angola era o quarto maior produtor de café do mundo...',
      fullContent: 'Entre as décadas de 1960 e 1970, Angola era o quarto maior produtor de café do mundo e o maior exportador de café robusta. O café angolano era reconhecido internacionalmente pela sua qualidade. No entanto, a independência em 1975 e a subsequente guerra civil devastaram a produção cafeeira. Muitas fazendas foram abandonadas, a infraestrutura foi destruída e o conhecimento técnico foi perdido. Hoje, Angola produz apenas uma fração do que produzia antes da independência. Existem esforços para revitalizar o setor, com programas de apoio aos pequenos agricultores e investimentos em processamento local, mas o caminho para recuperar a posição de destaque é longo.',
      replies: 12,
      likes: 8,
      isPrivate: false,
      requiresAccess: false,
      comments: [
        {
          id: 'c5',
          author: 'Fernando Costa',
          authorInitials: 'FC',
          timeAgo: '1 dia atrás',
          content: 'Que tristeza ver como o café angolano perdeu espaço. Espero que consigamos recuperar.',
          likes: 6,
          replies: []
        }
      ]
    },
    {
      id: '4',
      title: 'Agricultura: o futuro da economia angolana?',
      author: 'Pedro Mendes',
      authorInitials: 'PM',
      date: '12 Mar 2026',
      timeAgo: 'há 2 semanas',
      category: 'Economia',
      categoryType: 'public',
      excerpt: 'Angola tem condições excelentes para agricultura. Por que não conseguimos ser auto-suficientes em alimentos?',
      fullContent: 'Angola possui cerca de 58 milhões de hectares de terras aráveis, clima favorável e recursos hídricos abundantes. Apesar disso, o país ainda importa grande parte dos alimentos que consome. As razões incluem a falta de investimento no setor, a dependência histórica do petróleo, a destruição das infraestruturas durante a guerra civil e a dificuldade de acesso ao crédito para os agricultores. Para reverter este quadro, é necessário um plano integrado que inclua: recuperação de estradas rurais, linhas de crédito específicas, programas de extensão agrícola, investimento em irrigação e incentivos à agroindústria.',
      replies: 31,
      likes: 58,
      isPrivate: false,
      requiresAccess: false,
      comments: []
    },
    {
      id: '5',
      title: 'Comparação: Angola vs Nigéria - Gestão de recursos petrolíferos',
      author: 'Ana Ferreira',
      authorInitials: 'AF',
      date: '10 Mar 2026',
      timeAgo: 'há 3 semanas',
      category: 'Análise Comparativa',
      categoryType: 'public',
      excerpt: 'Ambos são grandes produtores de petróleo em África. O que podemos aprender com a experiência nigeriana?',
      fullContent: 'Nigéria e Angola são os dois maiores produtores de petróleo da África Subsaariana. Enquanto a Nigéria tem uma população muito maior e uma economia mais diversificada, Angola tem uma dependência ainda maior do petróleo. A Nigéria aprendeu, através de crises sucessivas, a necessidade de diversificar e desenvolveu setores como telecomunicações, serviços financeiros e entretenimento (Nollywood). Angola pode aprender com a experiência nigeriana a importância de: criar um fundo soberano robusto, investir em infraestrutura, promover políticas de conteúdo local e desenvolver cadeias de valor em setores não petrolíferos.',
      replies: 15,
      likes: 28,
      isPrivate: false,
      requiresAccess: false,
      comments: []
    },
    {
      id: '6',
      title: 'Reforma Fiscal em Angola: Desafios e Oportunidades',
      author: 'Ricardo Lopes',
      authorInitials: 'RL',
      date: '5 Mar 2026',
      timeAgo: 'há 1 mês',
      category: 'Economia',
      categoryType: 'private',
      excerpt: 'A reforma fiscal é essencial para reduzir a dependência do petróleo...',
      fullContent: 'A reforma fiscal é essencial para reduzir a dependência do petróleo e aumentar a arrecadação interna. Angola precisa diversificar suas fontes de receita através de uma tributação mais eficiente e justa. Isso inclui melhorar a administração tributária, ampliar a base de contribuintes, reduzir a evasão fiscal e criar incentivos para setores não petrolíferos. Experiências internacionais mostram que países que implementaram reformas fiscais abrangentes conseguiram aumentar significativamente sua resiliência económica.',
      replies: 8,
      likes: 34,
      isPrivate: true,
      requiresAccess: true,
      previewContent: '[Conteúdo privado - solicite acesso para ler mais]',
      comments: []
    },
    {
      id: '7',
      title: 'Impacto da Zona de Livre Comércio Continental Africana (ZLECA) em Angola',
      author: 'Carlos Manuel',
      authorInitials: 'CM',
      date: '8 Mar 2026',
      timeAgo: 'há 3 dias',
      category: 'Economia',
      categoryType: 'public',
      excerpt: 'A ZLECA entrou em vigor em 2021. Como Angola pode aproveitar esta oportunidade para diversificar sua economia e aumentar o comércio intra-africano?',
      fullContent: 'A Zona de Livre Comércio Continental Africana (ZLECA) é um dos maiores acordos comerciais do mundo em termos de número de países participantes. Para Angola, que historicamente tem dependido do petróleo e importado grande parte dos bens de consumo, este acordo representa tanto desafios quanto oportunidades. Os desafios incluem a necessidade de melhorar a competitividade da indústria local, reduzir custos de produção e eliminar barreiras burocráticas. As oportunidades incluem acesso a um mercado de 1,3 bilhão de consumidores, possibilidade de exportar produtos agrícolas e manufaturados, e atração de investimentos para zonas de processamento de exportação.',
      replies: 0,
      likes: 0,
      isPrivate: false,
      requiresAccess: false,
      comments: []
    },
    {
      id: '8',
      title: 'A Importância do Porto do Lobito para o Desenvolvimento Regional',
      author: 'Isabel Ferreira',
      authorInitials: 'IF',
      date: '3 Mar 2026',
      timeAgo: 'há 5 dias',
      category: 'Infraestrutura',
      categoryType: 'public',
      excerpt: 'O Porto do Lobito é um dos mais importantes portos de águas profundas de Angola. Como podemos maximizar seu potencial para o desenvolvimento do corredor do Lobito?',
      fullContent: 'O Porto do Lobito tem uma localização estratégica no litoral atlântico de Angola, servindo como porta de entrada e saída para produtos de Angola e dos países vizinhos como Zâmbia e RDC. Com investimentos recentes em modernização e expansão, o porto tem capacidade para movimentar cargas contentorizadas, granéis sólidos e líquidos, e carga geral. Para maximizar seu potencial, é necessário investir em conectividade ferroviária (Caminho de Ferro de Benguela), reduzir custos portuários, melhorar a eficiência alfandegária e desenvolver zonas de processamento de exportação nas proximidades.',
      replies: 0,
      likes: 0,
      isPrivate: false,
      requiresAccess: false,
      comments: []
    },
    {
      id: '9',
      title: 'O Futuro da Indústria de Telecomunicações em Angola',
      author: 'Joaquim Dias',
      authorInitials: 'JD',
      date: '28 Fev 2026',
      timeAgo: 'há 1 semana',
      category: 'Tecnologia',
      categoryType: 'public',
      excerpt: 'Com o avanço do 5G e da fibra ótica, como Angola pode aproveitar a transformação digital para impulsionar a economia e melhorar a prestação de serviços públicos?',
      fullContent: 'Angola tem feito progressos significativos no setor de telecomunicações nos últimos anos, com a expansão da rede de fibra ótica e o lançamento de serviços 5G em algumas áreas urbanas. No entanto, ainda existem desafios como a cobertura em áreas rurais, o custo dos serviços para a população, e a necessidade de desenvolver competências digitais. Para aproveitar plenamente o potencial da transformação digital, Angola precisa investir em infraestrutura de conectividade, promover a literacia digital, incentivar a inovação e o empreendedorismo tecnológico, e criar um ambiente regulatório favorável ao investimento privado.',
      replies: 0,
      likes: 0,
      isPrivate: false,
      requiresAccess: false,
      comments: []
    },
    {
      id: '10',
      title: 'Estratégias para o Turismo Sustentável em Angola',
      author: 'Helena Monteiro',
      authorInitials: 'HM',
      date: '25 Fev 2026',
      timeAgo: 'há 1 semana',
      category: 'Turismo',
      categoryType: 'private',
      excerpt: 'Angola tem um enorme potencial turístico ainda inexplorado. Como desenvolver um turismo sustentável que beneficie as comunidades locais?',
      fullContent: 'Angola possui paisagens deslumbrantes, desde as praias do Namibe até as quedas da Kalandula e a biodiversidade da Kissama. O turismo sustentável pode ser uma fonte importante de diversificação económica, criando empregos e gerando divisas. Para desenvolver o setor, Angola precisa investir em infraestrutura turística, capacitar recursos humanos, promover o país internacionalmente, simplificar o processo de vistos e garantir a proteção ambiental e a valorização do patrimônio cultural.',
      replies: 0,
      likes: 0,
      isPrivate: true,
      requiresAccess: true,
      previewContent: '[Conteúdo privado - solicite acesso para ler mais]',
      comments: []
    },
    {
      id: '11',
      title: 'O Papel da Sociedade Civil na Consolidação da Democracia em Angola',
      author: 'Mário Fernando',
      authorInitials: 'MF',
      date: '20 Fev 2026',
      timeAgo: 'há 2 semanas',
      category: 'Sociedade',
      categoryType: 'public',
      excerpt: 'Qual o papel das organizações da sociedade civil, movimentos cívicos e associações no fortalecimento das instituições democráticas em Angola?',
      fullContent: 'A sociedade civil desempenha um papel fundamental na consolidação da democracia, na promoção dos direitos humanos e no combate à corrupção. Em Angola, apesar dos desafios, existem organizações que trabalham em áreas como transparência, participação cidadã, proteção ambiental e direitos das mulheres. Para fortalecer o papel da sociedade civil, é necessário criar um ambiente legal que garanta a liberdade de associação e expressão, promover o diálogo entre o governo e a sociedade civil, e capacitar as organizações para que possam desempenhar eficazmente as suas funções.',
      replies: 0,
      likes: 0,
      isPrivate: false,
      requiresAccess: false,
      comments: []
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos os Tópicos' },
    { id: 'economia', label: 'Economia' },
    { id: 'historia', label: 'História' },
    { id: 'sociedade', label: 'Sociedade' },
    { id: 'analise', label: 'Análise Comparativa' },
    { id: 'infraestrutura', label: 'Infraestrutura' },
    { id: 'tecnologia', label: 'Tecnologia' },
    { id: 'turismo', label: 'Turismo' },
  ];

  const filterButtons = [
    { id: 'all', label: 'Todos' },
    { id: 'public', label: 'Públicos' },
    { id: 'private', label: 'Privados' },
    { id: 'my', label: 'Os meus' },
  ];

  const popularTopics = [
    { id: 1, name: 'Diversificação Económica', count: 45 },
    { id: 2, name: 'História Colonial', count: 38 },
    { id: 3, name: 'Petróleo', count: 32 },
    { id: 4, name: 'Agricultura', count: 28 },
    { id: 5, name: 'Educação', count: 25 },
    { id: 6, name: 'Infraestruturas', count: 22 },
    { id: 7, name: 'Investimento Estrangeiro', count: 19 },
    { id: 8, name: 'Desenvolvimento Regional', count: 17 },
  ];

  // Função para filtrar e rolar até o tópico específico
  const filterAndScrollToTopic = (topicTitle: string) => {
    setSearchQuery(topicTitle);
    setActiveFilter('all');
    setSelectedCategory('all');
    setTimeout(() => {
      const discussionsSection = document.getElementById('discussions-section');
      if (discussionsSection) {
        discussionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleLike = (id: string) => {
    if (!isAuthenticated) {
      setAuthAction('dar like em publicações');
      setShowAuthPrompt(true);
      return;
    }
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCommentLike = (commentId: string) => {
    if (!isAuthenticated) {
      setAuthAction('dar like em comentários');
      setShowAuthPrompt(true);
      return;
    }
    setCommentsLiked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleRequestAccess = (discussionId: string) => {
    if (!isAuthenticated) {
      setAuthAction('solicitar acesso ao conteúdo');
      setShowAuthPrompt(true);
      return;
    }
    setAccessRequested(prev => new Set(prev).add(discussionId));
    alert(`Solicitação de acesso enviada para o conteúdo. Aguarde aprovação do autor.`);
  };

  const toggleComments = (discussionId: string) => {
    setCommentsExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(discussionId)) {
        newSet.delete(discussionId);
      } else {
        newSet.add(discussionId);
      }
      return newSet;
    });
  };

  const handleAddComment = (discussionId: string) => {
    if (!isAuthenticated) {
      setAuthAction('comentar');
      setShowAuthPrompt(true);
      return;
    }
    if (newComment.trim()) {
      const discussion = discussions.find(d => d.id === discussionId);
      if (discussion) {
        const newCommentObj: Comment = {
          id: `new_${Date.now()}`,
          author: 'Usuário',
          authorInitials: 'US',
          timeAgo: 'agora mesmo',
          content: newComment,
          likes: 0,
          replies: []
        };
        discussion.comments = [newCommentObj, ...(discussion.comments || [])];
        discussion.replies = (discussion.replies || 0) + 1;
        setNewComment('');
      }
    }
  };

  const handleAddReply = (discussionId: string, parentCommentId: string) => {
    if (!isAuthenticated) {
      setAuthAction('responder a comentário');
      setShowAuthPrompt(true);
      return;
    }
    if (replyText.trim()) {
      const discussion = discussions.find(d => d.id === discussionId);
      if (discussion && replyingTo) {
        const newReply: Comment = {
          id: `reply_${Date.now()}`,
          author: 'Usuário',
          authorInitials: 'US',
          timeAgo: 'agora mesmo',
          content: replyText,
          likes: 0,
          replies: []
        };
        
        const updateComments = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: [newReply, ...(comment.replies || [])]
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateComments(comment.replies)
              };
            }
            return comment;
          });
        };
        
        if (discussion.comments) {
          discussion.comments = updateComments(discussion.comments);
          discussion.replies = (discussion.replies || 0) + 1;
        }
        setReplyText('');
        setReplyingTo(null);
      }
    }
  };

  const openActionModal = (type: 'report' | 'share' | 'save' | 'comment_report', itemId: string) => {
    setActionModalType(type);
    setSelectedItemId(itemId);
    setActionModalOpen(true);
  };

  const handleActionConfirm = () => {
    if (actionModalType === 'report') {
      alert('Conteúdo reportado com sucesso! A nossa equipa irá analisar.');
    } else if (actionModalType === 'share') {
      alert('Link copiado para área de transferência!');
    } else if (actionModalType === 'save') {
      alert('Conteúdo guardado nos seus favoritos!');
    } else if (actionModalType === 'comment_report') {
      alert('Comentário reportado com sucesso! A nossa equipa irá analisar.');
    }
    setActionModalOpen(false);
    setSelectedItemId(null);
  };

  const getHeatScore = (likes: number, replies: number) => {
    const score = likes + replies * 2;
    if (score > 100) return { label: 'Muito Quente', icon: Flame, color: 'text-red-500' };
    if (score > 50) return { label: 'Quente', icon: Zap, color: 'text-orange-500' };
    if (score > 20) return { label: 'Tendência', icon: TrendingUp, color: 'text-green-500' };
    return null;
  };

  const toggleAccordion = (id: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderComment = (comment: Comment, discussionId: string, isReply: boolean = false) => {
    const isCommentLiked = commentsLiked.has(comment.id);
    const commentLikeCount = comment.likes + (isCommentLiked ? 1 : 0);
    
    return (
      <div key={comment.id} className={`${!isReply ? 'border-b border-slate-100 pb-4' : 'ml-8 mt-3 border-l-2 border-slate-200 pl-4'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-8 h-8 ring-2 ring-slate-100">
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs">
                {comment.authorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-slate-900">{comment.author}</span>
                <span className="text-xs text-slate-400">{comment.timeAgo}</span>
              </div>
              <p className="text-sm text-slate-600 mb-2">{comment.content}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleCommentLike(comment.id)}
                  className={`flex items-center gap-1 text-xs transition-all duration-200 ${
                    isCommentLiked ? 'text-red-600 scale-105' : 'text-slate-400 hover:text-red-600'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{commentLikeCount}</span>
                </button>
                <button
                  onClick={() => setReplyingTo({ comment, discussionId })}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  💬 Responder
                </button>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openActionModal('comment_report', comment.id)}>
                <Flag className="w-3 h-3 mr-2" />
                Denunciar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {replyingTo?.comment.id === comment.id && replyingTo.discussionId === discussionId && (
          <div className="mt-3 ml-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-start gap-3">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-600 text-white text-xs">
                  {isAuthenticated ? 'EU' : '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder={`Responder a ${comment.author}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  className="resize-none text-sm"
                  disabled={!isAuthenticated}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddReply(discussionId, comment.id)}
                    disabled={!replyText.trim() || !isAuthenticated}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Responder
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            {comment.replies.map(reply => renderComment(reply, discussionId, true))}
          </div>
        )}
      </div>
    );
  };

  const filteredDiscussions = discussions.filter(d => {
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'economia' && !d.category.includes('Economia')) return false;
      if (selectedCategory === 'historia' && !d.category.includes('História')) return false;
      if (selectedCategory === 'sociedade' && d.category !== 'Sociedade') return false;
      if (selectedCategory === 'analise' && d.category !== 'Análise Comparativa') return false;
      if (selectedCategory === 'infraestrutura' && d.category !== 'Infraestrutura') return false;
      if (selectedCategory === 'tecnologia' && d.category !== 'Tecnologia') return false;
      if (selectedCategory === 'turismo' && d.category !== 'Turismo') return false;
    }
    if (activeFilter === 'public' && d.isPrivate) return false;
    if (activeFilter === 'private' && !d.isPrivate) return false;
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase()) && !d.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const displayedDiscussions = filteredDiscussions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDiscussions.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Nova publicação:', newPost);
    alert(`Conteúdo "${newPost.title}" enviado para análise!`);
    setNewPost({ title: '', content: '', isPrivate: false, image: null });
    setActiveTab('discussions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <section className="relative text-white overflow-hidden" style={{ background: '#C1121F' }}>
        <div className="absolute inset-0 bg-black/20" style={{ background: 'rgba(0,0,0,0.2)' }}></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" style={{ background: 'transparent' }}>
          <div className="flex items-center space-x-3 mb-4 animate-in fade-in slide-in-from-left-5 duration-500" style={{ background: 'transparent' }}>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Espaço de Debate</h1>
          </div>
          <p className="text-xl text-red-100 max-w-3xl animate-in fade-in slide-in-from-left-5 duration-500 delay-100">
            Participe das discussões, compartilhe conhecimento e conecte-se com a comunidade angolana.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isAuthenticated && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-2">Participe dos debates!</h3>
                <p className="text-sm text-slate-700 mb-3">
                  Você pode ler as discussões, mas para comentar, criar tópicos e dar likes, é necessário criar uma conta.
                </p>
                <Button
                  onClick={() => {
                    setAuthAction('participar dos debates');
                    setShowAuthPrompt(true);
                  }}
                  className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Entrar ou Cadastrar
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid grid-cols-2 w-full sm:w-auto bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="discussions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">Discussões</TabsTrigger>
              <TabsTrigger value="new" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">Nova Publicação</TabsTrigger>
            </TabsList>
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  setAuthAction('criar novos tópicos de debate');
                  setShowAuthPrompt(true);
                  return;
                }
                setActiveTab('new');
              }}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto group"
            >
              {!isAuthenticated && <Lock className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />}
              {isAuthenticated && <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />}
              Criar Novo Tópico
            </Button>
          </div>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div id="discussions-section" className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1 space-y-6">
                {/* Search Bar */}
                <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Buscar tópicos, discussões..."
                        className="pl-9 border-slate-200 focus:border-red-300 focus:ring-red-200 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {filterButtons.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeFilter === filter.id
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Category Dropdown */}
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60 w-fit">
                  <span className="text-sm text-slate-600 font-medium">Categoria:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discussion List - ACCORDION STYLE */}
                <div className="space-y-3">
                  {displayedDiscussions.map((discussion, index) => {
                    const isExpanded = expandedPosts.has(discussion.id);
                    const showComments = commentsExpanded.has(discussion.id);
                    const hasAccess = accessRequested.has(discussion.id) || !discussion.requiresAccess;
                    const isLiked = likedPosts.has(discussion.id);
                    const likeCount = discussion.likes + (isLiked ? 1 : 0);
                    const heatInfo = getHeatScore(discussion.likes, discussion.replies);
                    const HeatIcon = heatInfo?.icon;

                    return (
                      <div 
                        key={discussion.id} 
                        className="animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Card className={`overflow-hidden border-slate-200/80 bg-white/90 backdrop-blur-sm transition-all duration-300 ${
                          isExpanded ? 'shadow-xl border-red-200/50' : 'shadow-sm hover:shadow-md'
                        }`}>
                          {/* Accordion Header - Clicável */}
                          <div 
                            className="cursor-pointer"
                            onClick={() => toggleAccordion(discussion.id)}
                          >
                            <div className="px-6 py-4 flex justify-between items-start relative">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-3">
                                  {discussion.categoryType === 'public' ? (
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                                      <Globe className="w-3 h-3" />
                                      PÚBLICO
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                                      <Lock className="w-3 h-3" />
                                      PRIVADO
                                    </Badge>
                                  )}
                                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{discussion.category}</span>
                                  
                                  {heatInfo && (
                                    null
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="relative">
                                    <Avatar className="w-10 h-10 ring-4 ring-white shadow-md">
                                      <AvatarFallback className={`text-white font-medium text-sm ${
                                        discussion.categoryType === 'public' 
                                          ? 'bg-gradient-to-br from-red-500 to-red-600' 
                                          : 'bg-gradient-to-br from-amber-500 to-amber-600'
                                      }`}>
                                        {discussion.authorInitials}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-800">{discussion.author}</span>
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                      <span>{discussion.timeAgo || discussion.date}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300 pr-8">
                                  {discussion.title}
                                </CardTitle>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100">
                                      <MoreVertical className="h-4 w-4 text-slate-400" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-xl">
                                    <DropdownMenuItem onClick={() => openActionModal('report', discussion.id)}>
                                      <Flag className="w-3 h-3 mr-2" />
                                      Denunciar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openActionModal('share', discussion.id)}>
                                      <Share2 className="w-3 h-3 mr-2" />
                                      Compartilhar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openActionModal('save', discussion.id)}>
                                      <Bookmark className="w-3 h-3 mr-2" />
                                      Guardar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                
                                <button 
                                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAccordion(discussion.id);
                                  }}
                                >
                                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Accordion Content - Expandido */}
                          {isExpanded && (
                            <div className="px-6 pb-4 pt-2 border-t border-slate-100 mt-2 animate-in slide-in-from-top-2 duration-200">
                              <div className="mb-4">
                                {discussion.isPrivate && discussion.requiresAccess && !hasAccess ? (
                                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                                    <p className="text-amber-700 mb-3">{discussion.previewContent || '[Conteúdo privado - solicite acesso para ler mais]'}</p>
                                    <Button
                                      onClick={() => handleRequestAccess(discussion.id)}
                                      variant="outline"
                                      className="border-amber-400 text-amber-700 hover:bg-amber-100"
                                    >
                                      <Lock className="w-4 h-4 mr-2" />
                                      Solicitar Acesso
                                    </Button>
                                  </div>
                                ) : (
                                  <p className="text-slate-600 leading-relaxed">
                                    {discussion.fullContent || discussion.excerpt}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-6 text-sm border-t border-slate-100 pt-4">
                                <button
                                  onClick={() => toggleComments(discussion.id)}
                                  className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-all duration-200 group/comment"
                                >
                                  <div className="p-1 rounded-full bg-slate-100 group-hover/comment:bg-red-100 transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium">{discussion.replies}</span>
                                  <span className="text-xs text-slate-400">comentários</span>
                                </button>
                                <button
                                  onClick={() => handleLike(discussion.id)}
                                  className={`flex items-center gap-2 transition-all duration-200 group/like ${
                                    isLiked ? 'text-red-600' : 'text-slate-500 hover:text-red-600'
                                  }`}
                                >
                                  <div className={`p-1 rounded-full transition-colors ${isLiked ? 'bg-red-100' : 'bg-slate-100 group-hover/like:bg-red-100'}`}>
                                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-red-600' : ''}`} />
                                  </div>
                                  <span className="font-medium">{likeCount}</span>
                                  <span className="text-xs text-slate-400">likes</span>
                                </button>
                                <div className="flex-1 text-right">
                                  
                                </div>
                              </div>

                              {/* Comments Section */}
                              {showComments && (
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-semibold text-slate-900">
                                        Comentários ({discussion.comments?.length || 0})
                                      </h4>
                                    </div>
                                    
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                      {discussion.comments && discussion.comments.length > 0 ? (
                                        discussion.comments.map((comment) => renderComment(comment, discussion.id))
                                      ) : (
                                        <p className="text-center text-slate-500 py-8">
                                          Nenhum comentário ainda. Seja o primeiro a comentar!
                                        </p>
                                      )}
                                    </div>

                                    <div className="pt-4">
                                      <h4 className="font-semibold text-slate-900 mb-3">Adicione um comentário...</h4>
                                      <div className="flex items-start gap-3">
                                        <Avatar className="w-8 h-8">
                                          <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-600 text-white text-xs">
                                            {isAuthenticated ? 'EU' : '?'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <Textarea
                                            placeholder={isAuthenticated ? "Escreva seu comentário..." : "Faça login para comentar"}
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            rows={3}
                                            disabled={!isAuthenticated}
                                            className="resize-none"
                                          />
                                          {isAuthenticated && (
                                            <div className="flex justify-end mt-2">
                                              <Button
                                                onClick={() => handleAddComment(discussion.id)}
                                                disabled={!newComment.trim()}
                                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                              >
                                                <Send className="w-4 h-4 mr-2" />
                                                Comentar
                                              </Button>
                                            </div>
                                          )}
                                          {!isAuthenticated && (
                                            <p className="text-xs text-amber-600 mt-2">
                                              <button
                                                onClick={() => {
                                                  setAuthAction('comentar');
                                                  setShowAuthPrompt(true);
                                                }}
                                                className="underline hover:text-amber-700"
                                              >
                                                Faça login
                                              </button> para participar da discussão
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Card>
                      </div>
                    );
                  })}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      className="px-8 py-2 border-2 border-red-600 text-red-600 hover:bg-red-50 hover:border-red-700 hover:text-red-700 transition-all rounded-xl"
                    >
                      Carregar mais
                    </Button>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 space-y-4 flex-shrink-0 lg:sticky lg:top-4 lg:self-start">
                {/* Tópicos Populares */}
                <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
                  <button
                    onClick={() => setPopularTopicsOpen(!popularTopicsOpen)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-red-100 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm">Tópicos Populares</h3>
                    </div>
                    {popularTopicsOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {popularTopicsOpen && (
                    <CardContent className="pt-0 pb-4">
                      <div className="space-y-1">
                        {popularTopics.map((topic, idx) => (
                          <button
                            key={topic.id}
                            onClick={() => filterAndScrollToTopic(topic.name)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 w-5">{idx + 1}.</span>
                              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                #{topic.name}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              {topic.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Discussões Recentes - com filtro real */}
                <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
                  <button
                    onClick={() => setRecentDiscussionsOpen(!recentDiscussionsOpen)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm">Discussões Recentes</h3>
                    </div>
                    {recentDiscussionsOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {recentDiscussionsOpen && (
                    <CardContent className="pt-0 pb-4">
                      <div className="space-y-3">
                        {discussions.filter(d => d.id === '1' || d.id === '2' || d.id === '3' || d.id === '7').map((discussion) => (
                          <div 
                            key={discussion.id} 
                            onClick={() => filterAndScrollToTopic(discussion.title)}
                            className="px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px]">
                                  {discussion.authorInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium text-slate-600">{discussion.author}</span>
                            </div>
                            <p className="text-sm text-slate-700 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">{discussion.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400">{discussion.timeAgo}</span>
                              <span className="text-xs text-slate-300">•</span>
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <span className="text-slate-400">→</span>
                                <span>{discussion.replies} comentários</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Conversas Sem Respostas - com filtro real */}
                <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300">
                  <button
                    onClick={() => setUnansweredOpen(!unansweredOpen)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-100 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm">Conversas Sem Respostas</h3>
                    </div>
                    {unansweredOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {unansweredOpen && (
                    <CardContent className="pt-0 pb-4">
                      <div className="space-y-3">
                        {discussions.filter(d => d.replies === 0).map((discussion) => (
                          <div 
                            key={discussion.id} 
                            onClick={() => filterAndScrollToTopic(discussion.title)}
                            className="px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-[10px]">
                                  {discussion.authorInitials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium text-slate-600">{discussion.author}</span>
                            </div>
                            <p className="text-sm text-slate-700 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">{discussion.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400">{discussion.timeAgo}</span>
                              <span className="text-xs text-slate-300">•</span>
                              <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                                <span className="text-amber-500">→</span>
                                <span>{discussion.replies} comentários</span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* New Post Tab */}
          <TabsContent value="new">
            {!isAuthenticated ? (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-600" />
                    Autenticação Necessária
                  </CardTitle>
                  <CardDescription>
                    Você precisa estar logado para criar novos tópicos de debate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      setAuthAction('criar novos tópicos de debate');
                      setShowAuthPrompt(true);
                    }}
                    className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Entrar ou Cadastrar
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Discussão</CardTitle>
                  <CardDescription>
                    Inicie um novo debate sobre história económica de Angola
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPost} className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                        Título da Discussão
                      </label>
                      <Input
                        id="title"
                        placeholder="Digite o título do conteúdo..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                        Descrição
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Descreva o conteúdo..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                        Categoria
                      </label>
                      <select
                        id="category"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="economia">Economia</option>
                        <option value="historia">História</option>
                        <option value="sociedade">Sociedade</option>
                        <option value="analise">Análise Comparativa</option>
                        <option value="infraestrutura">Infraestrutura</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="turismo">Turismo</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
                        Duração
                      </label>
                      <Input
                        id="duration"
                        placeholder="Ex: 15 min"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Imagem (opcional)
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors cursor-pointer">
                        <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm text-slate-600">Clique ou arraste</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Adicione uma imagem para ilustrar o seu tópico
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-amber-600" />
                        <div>
                          <Label htmlFor="private-mode" className="text-sm font-medium cursor-pointer">
                            Conteúdo Restrito
                          </Label>
                          <p className="text-xs text-slate-600">
                            O conteúdo só será visível após aprovação
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="private-mode"
                        checked={newPost.isPrivate}
                        onCheckedChange={(checked) => setNewPost({ ...newPost, isPrivate: checked })}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-sm text-blue-900 mb-2">Diretrizes do Fórum</h4>
                      <ul className="space-y-1 text-xs text-blue-800">
                        <li>✓ Seja respeitoso com todos os participantes</li>
                        <li>✓ Baseie argumentos em factos e fontes confiáveis</li>
                        <li>✓ Mantenha o foco em temas relacionados com a história económica de Angola</li>
                        <li>✓ Evite linguagem ofensiva ou discriminatória</li>
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab('discussions')}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                        <Send className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Action Modal */}
      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {actionModalType === 'report' && 'Denunciar'}
              {actionModalType === 'share' && 'Compartilhar'}
              {actionModalType === 'save' && 'Guardar'}
              {actionModalType === 'comment_report' && 'Denunciar Comentário'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {actionModalType === 'report' && 'Formulário para denunciar conteúdo impróprio'}
              {actionModalType === 'share' && 'Opções para compartilhar este conteúdo'}
              {actionModalType === 'save' && 'Opções para guardar este conteúdo'}
              {actionModalType === 'comment_report' && 'Formulário para denunciar um comentário'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {actionModalType === 'report' && (
              <p className="text-slate-600">
                Tem certeza que deseja denunciar este conteúdo? A nossa equipa irá analisar a sua denúncia.
              </p>
            )}
            {actionModalType === 'share' && (
              <div className="space-y-3">
                <p className="text-slate-600">Compartilhe este conteúdo com outras pessoas:</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" className="flex-1 rounded-xl">WhatsApp</Button>
                  <Button variant="outline" className="flex-1 rounded-xl">Facebook</Button>
                  <Button variant="outline" className="flex-1 rounded-xl">Twitter</Button>
                </div>
                <p className="text-xs text-slate-400 text-center mt-2">ou copie o link para partilhar</p>
              </div>
            )}
            {actionModalType === 'save' && (
              <p className="text-slate-600">
                Guardar este conteúdo nos seus favoritos para aceder mais tarde.
              </p>
            )}
            {actionModalType === 'comment_report' && (
              <p className="text-slate-600">
                Tem certeza que deseja denunciar este comentário? A nossa equipa irá analisar.
              </p>
            )}
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setActionModalOpen(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleActionConfirm}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl"
            >
              {actionModalType === 'report' && 'Confirmar Denúncia'}
              {actionModalType === 'share' && 'Copiar Link'}
              {actionModalType === 'save' && 'Guardar'}
              {actionModalType === 'comment_report' && 'Confirmar Denúncia'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AuthPrompt
        open={showAuthPrompt}
        onOpenChange={setShowAuthPrompt}
        action={authAction}
      />
    </div>
  );
}