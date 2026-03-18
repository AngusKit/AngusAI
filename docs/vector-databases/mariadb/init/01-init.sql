-- MariaDB 11.7+ 向量支持初始化

-- 创建示例向量表（1536维，适配 OpenAI Embedding）
CREATE TABLE IF NOT EXISTS embeddings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536) NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 创建向量索引
ALTER TABLE embeddings ADD VECTOR INDEX idx_embedding (embedding);

SELECT 'MariaDB Vector initialized successfully!' AS status;
