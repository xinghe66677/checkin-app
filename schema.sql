-- ============================================
-- 在 Supabase SQL Editor 中执行以下 SQL
-- ============================================

-- 1. 打卡记录表
CREATE TABLE IF NOT EXISTS checkins (
  id BIGSERIAL PRIMARY KEY,
  person TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 配置表（存储两个人的名字）
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 3. 插入默认名字
INSERT INTO config (key, value) VALUES ('person1', '小明')
  ON CONFLICT (key) DO NOTHING;
INSERT INTO config (key, value) VALUES ('person2', '小红')
  ON CONFLICT (key) DO NOTHING;

-- 4. 开启 RLS 并创建策略（允许所有人读写）
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select" ON checkins FOR SELECT USING (true);
CREATE POLICY "public_insert" ON checkins FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select" ON config FOR SELECT USING (true);
CREATE POLICY "public_insert" ON config FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON config FOR UPDATE USING (true) WITH CHECK (true);
