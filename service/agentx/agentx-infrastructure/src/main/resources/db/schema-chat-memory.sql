-- ChatMemory 持久化表，供 JdbcChatMemoryStore 使用
-- 启用 agentx.memory.jdbc.enabled=true 时需确保此表已创建

-- H2 / MySQL / PostgreSQL 通用
CREATE TABLE IF NOT EXISTS chat_memory (
  memory_id VARCHAR(255) PRIMARY KEY,
  content TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
