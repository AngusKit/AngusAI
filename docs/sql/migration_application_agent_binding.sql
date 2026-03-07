-- 应用与智能体一对多关系迁移脚本
-- 执行前请根据实际使用的数据库类型选择 MySQL 或 PostgreSQL 版本

-- ========== MySQL ==========
-- 1. 创建 ai_application_agent 表
CREATE TABLE IF NOT EXISTS `ai_application_agent` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键',
    `application_id` BIGINT      NOT NULL COMMENT '应用ID',
    `agent_id`      BIGINT       NOT NULL COMMENT '智能体ID',
    `is_default`    TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '是否为默认智能体',
    `sort_order`    INT          NOT NULL DEFAULT 0 COMMENT '排序号',
    PRIMARY KEY (`id`),
    INDEX `idx_application_id` (`application_id`),
    INDEX `idx_agent_id` (`agent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用-智能体绑定关系';

-- 2. 迁移现有数据（若 ai_application 表有 agent_id 列）
-- INSERT INTO ai_application_agent (application_id, agent_id, is_default, sort_order)
-- SELECT id, agent_id, 1, 0 FROM ai_application WHERE agent_id IS NOT NULL;

-- 3. 删除 ai_application.agent_id 列（迁移完成后执行）
-- ALTER TABLE ai_application DROP COLUMN agent_id;

-- ========== PostgreSQL ==========
-- 1. 创建 ai_application_agent 表
-- CREATE TABLE IF NOT EXISTS ai_application_agent (
--     id             BIGSERIAL    PRIMARY KEY,
--     application_id BIGINT       NOT NULL,
--     agent_id       BIGINT       NOT NULL,
--     is_default     BOOLEAN      NOT NULL DEFAULT true,
--     sort_order     INTEGER      NOT NULL DEFAULT 0
-- );
-- CREATE INDEX idx_ai_application_agent_application_id ON ai_application_agent(application_id);
-- CREATE INDEX idx_ai_application_agent_agent_id ON ai_application_agent(agent_id);

-- 2. 迁移现有数据
-- INSERT INTO ai_application_agent (application_id, agent_id, is_default, sort_order)
-- SELECT id, agent_id, true, 0 FROM ai_application WHERE agent_id IS NOT NULL;

-- 3. 删除 agent_id 列
-- ALTER TABLE ai_application DROP COLUMN agent_id;
