-- ══════════════════════════════════════════════════════════════════
--  AMPLIA — Migrations de correção
--  Execute no SQL Editor do Supabase
--  Ordem: rodar tudo de uma vez ou em sequência
-- ══════════════════════════════════════════════════════════════════

-- ── 1. Adicionar coluna printer_share na tabela sales ──────────
--    (caso ainda não exista — o schema original não tinha)
ALTER TABLE sales
  ADD COLUMN IF NOT EXISTS printer_share numeric(10,2) DEFAULT 0;

-- ── 2. Corrigir coluna affiliate_commission → affiliate_share ───
--    O schema correto usa affiliate_share. Se você criou com o nome
--    errado, use este comando. Se já está certo, ignore.
-- ALTER TABLE sales RENAME COLUMN affiliate_commission TO affiliate_share;

-- ── 3. Adicionar platform_settings extras (suporte e env Asaas) ─
INSERT INTO platform_settings (key, value)
VALUES
  ('support_email', 'contato@amplia.com.br'),
  ('asaas_env',     'sandbox')
ON CONFLICT (key) DO NOTHING;

-- ── 4. Garantir que reader_xp tem todas as colunas necessárias ──
ALTER TABLE reader_xp
  ADD COLUMN IF NOT EXISTS books_acquired integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS books_read     integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pages_read     integer DEFAULT 0;

-- ── 5. Garantir que affiliate_xp tem total_revenue ──────────────
ALTER TABLE affiliate_xp
  ADD COLUMN IF NOT EXISTS total_revenue numeric(10,2) DEFAULT 0;

-- ── 6. Garantir que author_xp tem books_published ───────────────
ALTER TABLE author_xp
  ADD COLUMN IF NOT EXISTS books_published integer DEFAULT 0;

-- ── 7. Índices de performance para queries frequentes ────────────
CREATE INDEX IF NOT EXISTS idx_sales_buyer_id      ON sales(buyer_id);
CREATE INDEX IF NOT EXISTS idx_sales_printer_id    ON sales(printer_id);
CREATE INDEX IF NOT EXISTS idx_sales_affiliate_id  ON sales(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_sales_status        ON sales(status);
CREATE INDEX IF NOT EXISTS idx_books_author_id     ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_status        ON books(status);
CREATE INDEX IF NOT EXISTS idx_feed_posts_author   ON feed_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_reviews_book_id     ON reviews(book_id);

-- ── 8. RLS policies faltantes para operações do sistema ─────────

-- author_xp: autor pode ler o próprio XP
CREATE POLICY IF NOT EXISTS "author_xp: leitura própria"
  ON author_xp FOR SELECT
  USING (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

-- affiliate_xp: afiliado pode ler o próprio XP
CREATE POLICY IF NOT EXISTS "affiliate_xp: leitura própria"
  ON affiliate_xp FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- reader_xp: leitor pode ler o próprio XP
CREATE POLICY IF NOT EXISTS "reader_xp: leitura própria"
  ON reader_xp FOR SELECT
  USING (reader_id = auth.uid());

-- sales: comprador pode ver suas próprias compras
CREATE POLICY IF NOT EXISTS "sales: leitura do comprador"
  ON sales FOR SELECT
  USING (buyer_id = auth.uid());

-- sales: gráfica pode ver pedidos atribuídos a ela
CREATE POLICY IF NOT EXISTS "sales: leitura da gráfica"
  ON sales FOR SELECT
  USING (printer_id IN (SELECT id FROM printers WHERE user_id = auth.uid()));

-- feed_posts: leitura pública
CREATE POLICY IF NOT EXISTS "feed_posts: leitura pública"
  ON feed_posts FOR SELECT USING (true);

-- feed_posts: autores inserem seus próprios posts
CREATE POLICY IF NOT EXISTS "feed_posts: inserção pelo autor"
  ON feed_posts FOR INSERT
  WITH CHECK (author_id IN (SELECT id FROM authors WHERE user_id = auth.uid()));

-- feed_likes: leitura pública
CREATE POLICY IF NOT EXISTS "feed_likes: leitura pública"
  ON feed_likes FOR SELECT USING (true);

-- feed_likes: usuário curte/descurte
CREATE POLICY IF NOT EXISTS "feed_likes: gerenciamento pelo usuário"
  ON feed_likes FOR ALL USING (user_id = auth.uid());

-- feed_comments: leitura pública
CREATE POLICY IF NOT EXISTS "feed_comments: leitura pública"
  ON feed_comments FOR SELECT USING (true);

-- feed_comments: usuário comenta
CREATE POLICY IF NOT EXISTS "feed_comments: inserção autenticada"
  ON feed_comments FOR INSERT WITH CHECK (user_id = auth.uid());

-- achievements: leitura pública (ranking)
CREATE POLICY IF NOT EXISTS "achievements: leitura pública"
  ON achievements FOR SELECT USING (true);

-- reading_progress: usuário gerencia o próprio progresso
CREATE POLICY IF NOT EXISTS "reading_progress: gerenciamento próprio"
  ON reading_progress FOR ALL USING (user_id = auth.uid());

-- ── 9. Profiles: permitir leitura de outros perfis (para feed/ranking)
CREATE POLICY IF NOT EXISTS "profiles: leitura pública básica"
  ON profiles FOR SELECT USING (true);
