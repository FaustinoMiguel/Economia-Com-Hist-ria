-- ═══════════════════════════════════════════════════════════════════════════════
-- SEEDS — DADOS DE TESTE
-- Executar DEPOIS do schema.sql
--
-- Alterações vs seeds originais:
--   • utilizador: INSERT inclui pode_criar_quiz
--   • Utilizador superadmin adicionado (id=5)
--   • Utilizador com pode_criar_quiz=TRUE adicionado (id=6, subscrito autorizado)
--   • quiz: INSERT inclui criado_por explícito
--   • forum_enquete: enquete de exemplo no primeiro tópico
-- ═══════════════════════════════════════════════════════════════════════════════

USE economia_historia;

-- ─────────────────────────────────────────────────────────────────────────────
-- UTILIZADORES
-- Senha de todos: Test@1234 (hash bcrypt correcto, 10 rounds)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO utilizador (nome, email, senha_hash, telemovel, provincia, instituicao, curso, tipo, pode_criar_quiz) VALUES
(
    'Administrador',
    'admin@economiahistoria.ao',
    '$2b$10$yiWpM4lSoAJLal6rmHZkA.kCcxHx0vgRIsCGB1a2pzvO7yK.ZNMCG',
    '+244923000001', 'Luanda', 'Economia com História', 'Administração',
    'admin', FALSE
),
(
    'Carlos Mendonça',
    'carlos@email.com',
    '$2b$10$HIAsU/VTAg9XrCQzMGySluvKzafqUaAf4VgvepptTVD76jXmzIfQS',
    '+244923000002', 'Luanda', 'Universidade Agostinho Neto', 'Economia',
    'subscrito', FALSE
),
(
    'Maria Fernanda',
    'maria@email.com',
    '$2b$10$CsMhaavDbOxDq5CdDfWJRuK5rp2Uve9kbO19WQ5VpMjKiAs7O2lw.',
    '+244923000003', 'Benguela', 'Universidade Católica de Angola', 'História',
    'subscrito', FALSE
),
(
    'João Baptista',
    'joao@email.com',
    '$2b$10$qajOvzAveDPxEcJ5FP07vOEWKHiLBo/Sxg5Dc9iMfWJIlgALLjZA2',
    '+244923000004', 'Huambo', 'Instituto Superior Politécnico do Huambo', 'Gestão',
    'subscrito', FALSE
),
(
    'Super Administrador',
    'superadmin@economiahistoria.ao',
    '$2b$10$/se7k.ii0kYjoT0QmaWqz.F7LYvCXc7bPGfndlfmWsrbkNbj5d3he',
    '+244923000005', 'Luanda', 'Economia com História', 'Administração',
    'superadmin', FALSE
),
(
    'Ana Lúcia Cardoso',
    'ana@email.com',
    '$2b$10$1odRzd8QqwcHgM/CdlbUXe4E9f4OFedNHDDGG1nHAPY7Qu.LSe0b6',
    '+244923000006', 'Luanda', 'Universidade Jean Piaget', 'Economia',
    -- subscrito autorizado pelo admin a criar quizzes do Explorar
    'subscrito', TRUE
);

-- ─────────────────────────────────────────────────────────────────────────────
-- CONTEÚDOS
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO conteudo (titulo, descricao, tipo, categoria, tema, duracao, publicado_por) VALUES
(
    'Inflação em Angola: 1990–2014',
    'Uma análise detalhada do fenómeno inflacionário em Angola durante o período pós-independência até à estabilização económica.',
    'video', 'Economia', 'Inflação', '18:45', 1
),
(
    'Comércio no Período Colonial',
    'Como as rotas comerciais moldaram a economia angolana durante o colonialismo português.',
    'texto_normal', 'História', 'Período Colonial', '15 min leitura', 1
),
(
    'Mulheres nos Negócios em Angola',
    'O papel crescente das mulheres empreendedoras na economia angolana contemporânea.',
    'podcast', 'Economia', 'Empreendedorismo', '42:10', 1
),
(
    'O Papel do Petróleo na Economia Angolana',
    'Análise crítica da dependência do petróleo e os desafios para a diversificação económica.',
    'texto_jindungo', 'Economia', 'Petróleo', '20 min leitura', 1
),
(
    'A Reforma Monetária de 1999',
    'Como a substituição do Kwanza antigo impactou o quotidiano dos angolanos.',
    'video', 'Economia', 'Moeda', '22:30', 1
),
(
    'História da Moeda Angolana',
    'Das conchas zimbabweanas ao Kwanza: a evolução do sistema monetário em Angola.',
    'texto_normal', 'História', 'Moeda', '12 min leitura', 1
);

-- ─────────────────────────────────────────────────────────────────────────────
-- QUIZZES DO EXPLORAR
-- criado_por=1 (admin) e criado_por=6 (subscrito com pode_criar_quiz=TRUE)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO quiz (titulo, descricao, categoria, ativo, criado_por) VALUES
(
    'Economia Angolana: Básico',
    'Teste os seus conhecimentos sobre os fundamentos da economia angolana.',
    'Economia', TRUE, 1
),
(
    'História de Angola',
    'Questões sobre os principais períodos da história angolana.',
    'História', TRUE, 1
),
(
    'Moeda e Inflação',
    'Quiz criado por utilizador autorizado sobre moeda e inflação em Angola.',
    'Economia', TRUE, 6
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PERGUNTAS — Quiz 1: Economia Angolana Básico
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO quiz_pergunta (quiz_id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, ordem) VALUES
(
    1,
    'Qual foi o impacto da reforma monetária de 1999 em Angola?',
    'Redução da inflação',
    'Substituição do Kwanza antigo por uma nova moeda',
    'Aumento do salário mínimo',
    'Criação do Banco Central Africano',
    2,
    'A reforma monetária de 1999 substituiu o Kwanza antigo (AOK) pelo novo Kwanza (AOA), eliminando zeros da moeda.',
    1
),
(
    1,
    'Qual sector liderou o crescimento económico angolano entre 2005 e 2014?',
    'Agricultura',
    'Petróleo e gás',
    'Turismo',
    'Tecnologia',
    2,
    'O sector petrolífero foi o principal motor do crescimento económico angolano neste período, representando mais de 40% do PIB.',
    2
),
(
    1,
    'Qual é a moeda oficial de Angola?',
    'Escudo',
    'Real',
    'Kwanza',
    'Libra',
    3,
    'O Kwanza (AOA) é a moeda oficial de Angola desde 1977, com várias reformas ao longo dos anos.',
    3
),
(
    1,
    'Qual organismo regula o sistema financeiro angolano?',
    'Ministério das Finanças',
    'Banco Nacional de Angola',
    'Fundo Monetário Internacional',
    'Banco Mundial',
    2,
    'O Banco Nacional de Angola (BNA) é o banco central e regulador do sistema financeiro angolano.',
    4
),
(
    1,
    'O que significa a sigla PIB?',
    'Produto Interno Bruto',
    'Produto Internacional de Balança',
    'Plano de Investimento Base',
    'Programa de Iniciativa Bancária',
    1,
    'PIB — Produto Interno Bruto — é o valor total de bens e serviços produzidos num país num determinado período.',
    5
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PERGUNTAS — Quiz 2: História de Angola
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO quiz_pergunta (quiz_id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, ordem) VALUES
(
    2,
    'Em que ano Angola proclamou a sua independência?',
    '1961',
    '1975',
    '1980',
    '1990',
    2,
    'Angola proclamou a independência de Portugal a 11 de Novembro de 1975.',
    1
),
(
    2,
    'Qual foi o primeiro presidente de Angola?',
    'José Eduardo dos Santos',
    'Jonas Savimbi',
    'Agostinho Neto',
    'João Lourenço',
    3,
    'António Agostinho Neto foi o primeiro presidente da República Popular de Angola, de 1975 até à sua morte em 1979.',
    2
),
(
    2,
    'Em que cidade foi assinado o Acordo de Paz de 2002?',
    'Luanda',
    'Namibe',
    'Luena',
    'Huambo',
    3,
    'O Memorando de Entendimento de Luena foi assinado a 4 de Abril de 2002, pondo fim à guerra civil angolana.',
    3
),
(
    2,
    'Qual movimento proclamou a independência de Angola em 1975?',
    'FNLA',
    'UNITA',
    'MPLA',
    'FLEC',
    3,
    'O MPLA (Movimento Popular de Libertação de Angola) proclamou a independência em Luanda a 11 de Novembro de 1975.',
    4
),
(
    2,
    'Qual é a capital de Angola?',
    'Benguela',
    'Huambo',
    'Lubango',
    'Luanda',
    4,
    'Luanda é a capital e maior cidade de Angola, situada na costa atlântica.',
    5
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PERGUNTAS — Quiz 3: Moeda e Inflação (criado por utilizador autorizado)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO quiz_pergunta (quiz_id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, ordem) VALUES
(
    3,
    'O que é inflação?',
    'Aumento generalizado e sustentado do nível de preços',
    'Redução da taxa de juro pelo banco central',
    'Aumento das exportações de petróleo',
    'Depreciação das reservas de ouro',
    1,
    'Inflação é o aumento generalizado e sustentado do nível de preços de bens e serviços numa economia.',
    1
),
(
    3,
    'Qual foi a taxa de inflação anual mais elevada registada em Angola na década de 1990?',
    'Cerca de 50%',
    'Cerca de 500%',
    'Mais de 4000%',
    'Cerca de 200%',
    3,
    'Angola registou taxas de hiperinflação superiores a 4000% ao ano durante os anos mais graves da guerra civil na década de 1990.',
    2
),
(
    3,
    'Qual instrumento usa o BNA para controlar a inflação?',
    'Taxa de câmbio fixa',
    'Taxa de juro de referência (taxa BNA)',
    'Congelamento de preços',
    'Emissão ilimitada de moeda',
    2,
    'O Banco Nacional de Angola usa a taxa de juro de referência como principal instrumento de política monetária para controlar a inflação.',
    3
),
(
    3,
    'O que significa "kwanza" como unidade monetária?',
    'Nome de um chefe guerreiro histórico',
    'Nome de um rio angolano',
    'Palavra quimbundo que significa "primeiro"',
    'Sigla de um tratado económico',
    2,
    'Kwanza é o nome de um rio angolano que serviu de inspiração para o nome da moeda nacional introduzida em 1977.',
    4
),
(
    3,
    'Qual das seguintes é uma consequência da hiperinflação?',
    'Aumento do poder de compra da população',
    'Erosão das poupanças e instabilidade económica',
    'Redução da dívida pública',
    'Aumento das exportações',
    2,
    'A hiperinflação destrói o valor das poupanças, gera incerteza económica e dificulta o planeamento de longo prazo.',
    5
);

-- ─────────────────────────────────────────────────────────────────────────────
-- TÓPICOS DO FÓRUM
-- ─────────────────────────────────────────────────────────────────────────────

-- Tópicos do fórum — apenas o texto, sem interações inventadas.
-- Votos, respostas e visualizações começam a zero; os utilizadores constroem
-- as interações (votar, responder, marcar solução).
INSERT INTO topico_forum (titulo, descricao, criado_por, categoria, tipo_privacidade) VALUES
  ('Exportação de petróleo: dependência económica', 'Angola continua altamente dependente das exportações de petróleo, que representam cerca de 95% das receitas de exportação e mais de 70% das receitas fiscais do governo. Esta dependência torna a economia angolana extremamente vulnerável às flutuações dos preços internacionais do petróleo. Quando os preços caem, como aconteceu em 2014-2016 e mais recentemente em 2020, o país enfrenta graves crises económicas, com desvalorização da moeda, aumento da dívida pública e cortes nos gastos sociais. A diversificação económica é apontada como solução, mas requer investimentos significativos em infraestrutura, educação e políticas públicas consistentes para desenvolver setores como agricultura, indústria transformadora e turismo.', 1, 'Economia Actual', 'publico'),
  ('O Caminho do Ferro de Benguela e a Carreação do Lobito', 'O Caminho de Ferro de Benguela (CFB) foi uma das infraestruturas mais importantes da África Austral, ligando o porto do Lobito, em Angola, à província mineralógica do Katanga, na atual República Democrática do Congo. Construído entre 1902 e 1929, o CFB desempenhou um papel crucial no comércio regional, escoando cobre, cobalto e outros minerais. Durante a guerra civil angolana (1975-2002), o caminho de ferro foi severamente danificado e ficou inoperante. Após a guerra, iniciou-se um processo de reabilitação que culminou com a reabertura em 2015. O Corredor do Lobito, que inclui o CFB, é agora uma das principais prioridades de investimento internacional, incluindo parcerias com os Estados Unidos e a União Europeia.', 1, 'Sociedade', 'publico'),
  ('O Ciclo do Café: Do auge à diversificação', 'Entre as décadas de 1960 e 1970, Angola era o quarto maior produtor de café do mundo e o maior exportador de café robusta. O café angolano era reconhecido internacionalmente pela sua qualidade. No entanto, a independência em 1975 e a subsequente guerra civil devastaram a produção cafeeira. Muitas fazendas foram abandonadas, a infraestrutura foi destruída e o conhecimento técnico foi perdido. Hoje, Angola produz apenas uma fração do que produzia antes da independência. Existem esforços para revitalizar o setor, com programas de apoio aos pequenos agricultores e investimentos em processamento local, mas o caminho para recuperar a posição de destaque é longo.', 1, 'História Económica', 'publico'),
  ('Agricultura: o futuro da economia angolana?', 'Angola possui cerca de 58 milhões de hectares de terras aráveis, clima favorável e recursos hídricos abundantes. Apesar disso, o país ainda importa grande parte dos alimentos que consome. As razões incluem a falta de investimento no setor, a dependência histórica do petróleo, a destruição das infraestruturas durante a guerra civil e a dificuldade de acesso ao crédito para os agricultores. Para reverter este quadro, é necessário um plano integrado que inclua: recuperação de estradas rurais, linhas de crédito específicas, programas de extensão agrícola, investimento em irrigação e incentivos à agroindústria.', 1, 'Economia', 'publico'),
  ('Comparação: Angola vs Nigéria - Gestão de recursos petrolíferos', 'Nigéria e Angola são os dois maiores produtores de petróleo da África Subsaariana. Enquanto a Nigéria tem uma população muito maior e uma economia mais diversificada, Angola tem uma dependência ainda maior do petróleo. A Nigéria aprendeu, através de crises sucessivas, a necessidade de diversificar e desenvolveu setores como telecomunicações, serviços financeiros e entretenimento (Nollywood). Angola pode aprender com a experiência nigeriana a importância de: criar um fundo soberano robusto, investir em infraestrutura, promover políticas de conteúdo local e desenvolver cadeias de valor em setores não petrolíferos.', 1, 'Análise Comparativa', 'publico'),
  ('Reforma Fiscal em Angola: Desafios e Oportunidades', 'A reforma fiscal é essencial para reduzir a dependência do petróleo e aumentar a arrecadação interna. Angola precisa diversificar suas fontes de receita através de uma tributação mais eficiente e justa. Isso inclui melhorar a administração tributária, ampliar a base de contribuintes, reduzir a evasão fiscal e criar incentivos para setores não petrolíferos. Experiências internacionais mostram que países que implementaram reformas fiscais abrangentes conseguiram aumentar significativamente sua resiliência económica.', 1, 'Economia', 'publico'),
  ('Impacto da Zona de Livre Comércio Continental Africana (ZLECA) em Angola', 'A Zona de Livre Comércio Continental Africana (ZLECA) é um dos maiores acordos comerciais do mundo em termos de número de países participantes. Para Angola, que historicamente tem dependido do petróleo e importado grande parte dos bens de consumo, este acordo representa tanto desafios quanto oportunidades. Os desafios incluem a necessidade de melhorar a competitividade da indústria local, reduzir custos de produção e eliminar barreiras burocráticas. As oportunidades incluem acesso a um mercado de 1,3 bilhão de consumidores, possibilidade de exportar produtos agrícolas e manufaturados, e atração de investimentos para zonas de processamento de exportação.', 1, 'Economia', 'publico'),
  ('A Importância do Porto do Lobito para o Desenvolvimento Regional', 'O Porto do Lobito tem uma localização estratégica no litoral atlântico de Angola, servindo como porta de entrada e saída para produtos de Angola e dos países vizinhos como Zâmbia e RDC. Com investimentos recentes em modernização e expansão, o porto tem capacidade para movimentar cargas contentorizadas, granéis sólidos e líquidos, e carga geral. Para maximizar seu potencial, é necessário investir em conectividade ferroviária (Caminho de Ferro de Benguela), reduzir custos portuários, melhorar a eficiência alfandegária e desenvolver zonas de processamento de exportação nas proximidades.', 1, 'Infraestrutura', 'publico'),
  ('O Futuro da Indústria de Telecomunicações em Angola', 'Angola tem feito progressos significativos no setor de telecomunicações nos últimos anos, com a expansão da rede de fibra ótica e o lançamento de serviços 5G em algumas áreas urbanas. No entanto, ainda existem desafios como a cobertura em áreas rurais, o custo dos serviços para a população, e a necessidade de desenvolver competências digitais. Para aproveitar plenamente o potencial da transformação digital, Angola precisa investir em infraestrutura de conectividade, promover a literacia digital, incentivar a inovação e o empreendedorismo tecnológico, e criar um ambiente regulatório favorável ao investimento privado.', 1, 'Tecnologia', 'publico'),
  ('Estratégias para o Turismo Sustentável em Angola', 'Angola possui paisagens deslumbrantes, desde as praias do Namibe até as quedas da Kalandula e a biodiversidade da Kissama. O turismo sustentável pode ser uma fonte importante de diversificação económica, criando empregos e gerando divisas. Para desenvolver o setor, Angola precisa investir em infraestrutura turística, capacitar recursos humanos, promover o país internacionalmente, simplificar o processo de vistos e garantir a proteção ambiental e a valorização do patrimônio cultural.', 1, 'Turismo', 'publico'),
  ('O Papel da Sociedade Civil na Consolidação da Democracia em Angola', 'A sociedade civil desempenha um papel fundamental na consolidação da democracia, na promoção dos direitos humanos e no combate à corrupção. Em Angola, apesar dos desafios, existem organizações que trabalham em áreas como transparência, participação cidadã, proteção ambiental e direitos das mulheres. Para fortalecer o papel da sociedade civil, é necessário criar um ambiente legal que garanta a liberdade de associação e expressão, promover o diálogo entre o governo e a sociedade civil, e capacitar as organizações para que possam desempenhar eficazmente as suas funções.', 1, 'Sociedade', 'publico');

-- ─────────────────────────────────────────────────────────────────────────────
-- LIVRO DO DIA
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO livro_do_dia (titulo, autor, ano, editora, genero, sobre_autor, trecho, citacao_destaque) VALUES
(
    'Angola: Uma Economia em Transição',
    'Alves da Rocha',
    '2010',
    'Edições Mayamba',
    'Economia',
    'Alves da Rocha é economista e professor universitário angolano, reconhecido pelos seus estudos sobre desenvolvimento económico em África.',
    'A economia angolana carrega o peso da dependência petrolífera e a esperança de uma diversificação que tarda em chegar mas que é inevitável para a soberania real do país.',
    'O petróleo financiou a paz, mas só a educação pode financiar o futuro.'
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ARTIGO DE EXEMPLO
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO artigo (titulo, subtitulo, slug, resumo, categoria, status, destaque, autor_id, tempo_leitura, publicado_em) VALUES
(
    'A Independência de Angola e os seus Impactos Económicos',
    'Uma análise dos desafios económicos enfrentados por Angola após 1975',
    'independencia-angola-impactos-economicos',
    'Este artigo analisa os principais desafios económicos que Angola enfrentou nos anos que se seguiram à proclamação da independência em 1975, com especial destaque para a hiperinflação, a dependência do petróleo e os esforços de reconstrução pós-guerra.',
    'História', 'publicado', TRUE, 1, 8, NOW()
);

INSERT INTO artigo_bloco (artigo_id, tipo, conteudo, ordem) VALUES
(1, 'paragrafo',    'A 11 de Novembro de 1975, Angola proclamava a sua independência de Portugal após séculos de colonialismo. Este marco histórico trouxe consigo não apenas a liberdade política, mas também desafios económicos imensos que moldaram o desenvolvimento do país nas décadas seguintes.', 1),
(1, 'titulo_secao', 'O Legado Colonial e a Herança Económica', 2),
(1, 'paragrafo',    'A economia herdada do período colonial era profundamente assimétrica. As estruturas produtivas foram desenhadas para servir os interesses metropolitanos, deixando Angola com uma base industrial frágil e uma dependência excessiva de matérias-primas — sobretudo petróleo, diamantes e café.', 3),
(1, 'destaque',     'O petróleo representava, em meados da década de 1980, mais de 90% das receitas de exportação angolanas.', 4),
(1, 'titulo_secao', 'Guerra Civil e Impacto Económico', 5),
(1, 'paragrafo',    'A guerra civil que se seguiu à independência devastou a infraestrutura económica do país. Estradas, pontes, sistemas de irrigação e unidades produtivas foram destruídos. A hiperinflação atingiu valores superiores a 4000% ao ano na década de 1990, corroendo as poupanças e o poder de compra da população.', 6);

-- ─────────────────────────────────────────────────────────────────────────────
-- NOTIFICAÇÕES
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO notificacao (usuario_id, tipo, titulo, mensagem, link_destino) VALUES
(2, 'novo_quiz',   'Novo Quiz Disponível',  'Um novo quiz sobre Economia Angolana foi publicado. Teste os seus conhecimentos!', '/resources'),
(2, 'novo_topico', 'Novo Tópico no Fórum',  'Maria Fernanda criou um novo tópico: "Inflação e o custo de vida em Luanda"', '/forum'),
(3, 'novo_quiz',   'Novo Quiz Disponível',  'Um novo quiz sobre História de Angola foi publicado.', '/resources'),
(4, 'novo_topico', 'Novo Tópico no Fórum',  'Carlos Mendonça iniciou um debate sobre diversificação económica.', '/forum'),
(6, 'novo_quiz',   'Permissão Atribuída',   'O administrador autorizou-te a criar quizzes no Explorar.', '/resources');
