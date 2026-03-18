-- 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建示例向量表
CREATE TABLE IF NOT EXISTS embeddings (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 HNSW 索引（推荐，适合高召回率场景）
CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw
    ON embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- 创建 IVFFlat 索引（适合大数据量场景）
-- CREATE INDEX IF NOT EXISTS idx_embeddings_ivfflat
--     ON embeddings
--     USING ivfflat (embedding vector_cosine_ops)
--     WITH (lists = 100);

SELECT 'PGVector initialized successfully!' AS status;
