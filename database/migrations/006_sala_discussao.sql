-- Migration 006: Sala de Discussão
-- Sala de Discussão é um espaço de chat privado gerido por um professor/admin.
-- O criador (professor) controla quem pode entrar e quem pode escrever.

CREATE TABLE IF NOT EXISTS sala_discussao (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo          VARCHAR(200) NOT NULL,
  descricao       TEXT,
  criador_id      INT UNSIGNED NOT NULL,
  -- Se ligada a um conteúdo ou tópico específico (opcional)
  conteudo_id     INT UNSIGNED DEFAULT NULL,
  topico_id       INT UNSIGNED DEFAULT NULL,
  -- Controlo de acesso
  so_membros_comentam TINYINT(1) NOT NULL DEFAULT 1,
  criado_em       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sala_criador    FOREIGN KEY (criador_id)  REFERENCES utilizador(id) ON DELETE CASCADE,
  CONSTRAINT fk_sala_conteudo   FOREIGN KEY (conteudo_id) REFERENCES conteudo(id)   ON DELETE SET NULL,
  CONSTRAINT fk_sala_topico     FOREIGN KEY (topico_id)   REFERENCES topico_forum(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Membros da sala (quem pode entrar)
CREATE TABLE IF NOT EXISTS sala_membro (
  sala_id         INT UNSIGNED NOT NULL,
  utilizador_id   INT UNSIGNED NOT NULL,
  pode_comentar   TINYINT(1) NOT NULL DEFAULT 1,
  aprovado        TINYINT(1) NOT NULL DEFAULT 0,
  entrou_em       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sala_id, utilizador_id),
  CONSTRAINT fk_membro_sala  FOREIGN KEY (sala_id)        REFERENCES sala_discussao(id) ON DELETE CASCADE,
  CONSTRAINT fk_membro_user  FOREIGN KEY (utilizador_id)  REFERENCES utilizador(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mensagens da sala
CREATE TABLE IF NOT EXISTS mensagem_sala (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sala_id         INT UNSIGNED NOT NULL,
  autor_id        INT UNSIGNED NOT NULL,
  mensagem        TEXT NOT NULL,
  criado_em       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_msg_sala  FOREIGN KEY (sala_id)   REFERENCES sala_discussao(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_autor FOREIGN KEY (autor_id)  REFERENCES utilizador(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para queries frequentes
CREATE INDEX idx_mensagem_sala_sala_id  ON mensagem_sala(sala_id, criado_em);
CREATE INDEX idx_sala_membro_user       ON sala_membro(utilizador_id);
