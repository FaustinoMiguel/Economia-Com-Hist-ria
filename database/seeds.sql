-- ============================================================
-- SEEDS — DADOS DE TESTE
-- Execute DEPOIS do schema.sql
-- ============================================================

USE economia_historia;

-- ============================================================
-- UTILIZADORES
-- Senha de todos: Test@1234 (hash bcrypt gerado com 10 rounds)
-- ============================================================
INSERT INTO utilizador (nome, email, senha_hash, telemovel, provincia, instituicao, curso, tipo) VALUES
(
    'Administrador',
    'admin@economiahistoria.ao',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uDdCqF3dO',
    '+244923000001',
    'Luanda',
    'Economia com História',
    'Administração',
    'admin'
),
(
    'Carlos Mendonça',
    'carlos@email.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uDdCqF3dO',
    '+244923000002',
    'Luanda',
    'Universidade Agostinho Neto',
    'Economia',
    'subscrito'
),
(
    'Maria Fernanda',
    'maria@email.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uDdCqF3dO',
    '+244923000003',
    'Benguela',
    'Universidade Católica de Angola',
    'História',
    'subscrito'
),
(
    'João Baptista',
    'joao@email.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uDdCqF3dO',
    '+244923000004',
    'Huambo',
    'Instituto Superior Politécnico do Huambo',
    'Gestão',
    'subscrito'
);

-- ============================================================
-- CONTEÚDOS
-- ============================================================
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

-- ============================================================
-- QUIZ
-- ============================================================
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
);

-- ============================================================
-- PERGUNTAS DO QUIZ 1
-- ============================================================
INSERT INTO quiz_pergunta (quiz_id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, ordem) VALUES
(
    1,
    'Qual foi o impacto da reforma monetária de 1999 em Angola?',
    'Redução da inflação',
    'Substituição do Kwanza antigo por uma nova moeda',
    'Aumento do salário mínimo',
    'Criação do Banco Central Africano',
    1,
    'A reforma monetária de 1999 substituiu o Kwanza antigo (AOK) por um novo Kwanza (AOA), eliminando zeros da moeda.',
    1
),
(
    1,
    'Qual sector liderou o crescimento económico angolano entre 2005 e 2014?',
    'Agricultura',
    'Petróleo e gás',
    'Turismo',
    'Tecnologia',
    1,
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
    2,
    'O Kwanza (AOA) é a moeda oficial de Angola desde 1977, com várias reformas ao longo dos anos.',
    3
);

-- ============================================================
-- PERGUNTAS DO QUIZ 2
-- ============================================================
INSERT INTO quiz_pergunta (quiz_id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta, explicacao, ordem) VALUES
(
    2,
    'Em que ano Angola proclamou a sua independência?',
    '1961',
    '1975',
    '1980',
    '1990',
    1,
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
    2,
    'António Agostinho Neto foi o primeiro presidente da República Popular de Angola, de 1975 até à sua morte em 1979.',
    2
);

-- ============================================================
-- TÓPICOS DO FÓRUM
-- ============================================================
INSERT INTO topico_forum (titulo, descricao, criado_por, tipo_privacidade, categoria, likes, respostas) VALUES
(
    'Exportação de petróleo e diversificação da economia',
    'Angola depende excessivamente do petróleo. Como podemos diversificar a nossa economia para garantir sustentabilidade a longo prazo?',
    2, 'publico', 'Economia', 12, 3
),
(
    'Inflação e o custo de vida em Luanda',
    'O impacto da inflação no quotidiano das famílias angolanas tem sido devastador. Partilhem as vossas experiências e análises.',
    3, 'publico', 'Economia', 8, 2
),
(
    'O papel da mulher na economia angolana',
    'Discussão sobre como as políticas públicas podem apoiar melhor o empreendedorismo feminino em Angola.',
    4, 'publico', 'Sociedade', 15, 4
);

-- ============================================================
-- RESPOSTAS DO FÓRUM
-- ============================================================
INSERT INTO resposta_forum (topico_id, autor_id, conteudo) VALUES
(1, 3, 'Concordo plenamente. A diversificação passa obrigatoriamente pelo investimento na agricultura e no sector tecnológico.'),
(1, 4, 'O turismo também é um sector com enorme potencial não explorado em Angola.'),
(1, 1, 'As políticas do PRODESI vão nesse sentido, mas a implementação ainda é lenta.'),
(2, 2, 'O kwanza perdeu muito valor. A inflação acumulada nos últimos anos afectou principalmente as classes médias.'),
(2, 4, 'É necessária uma política monetária mais agressiva do Banco Nacional de Angola.');

-- ============================================================
-- LIVRO DO DIA
-- ============================================================
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

-- ============================================================
-- NOTIFICAÇÕES DE EXEMPLO
-- ============================================================
INSERT INTO notificacao (usuario_id, tipo, titulo, mensagem, link_destino) VALUES
(2, 'novo_quiz',    'Novo Quiz Disponível', 'Um novo quiz sobre Economia Angolana foi publicado. Teste os seus conhecimentos!', '/quiz'),
(2, 'novo_topico',  'Novo Tópico no Fórum', 'Maria Fernanda criou um novo tópico: "Inflação e o custo de vida em Luanda"', '/forum'),
(3, 'novo_quiz',    'Novo Quiz Disponível', 'Um novo quiz sobre História de Angola foi publicado.', '/quiz');