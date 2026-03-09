package cloud.xcan.angus.core.ai.domain;

import java.io.File;

/**
 * 应用常量
 */
public interface Constants {

  // ==================== 聊天常量 ====================

  String CHAT_ATTACHMENTS_UPLOAD_BIZ_KEY = "angusAIChatAttachments";

  // ==================== 智能体常量 ====================
  /**
   * 智能体系统提示词最大长度（注意：这里允许100k字符，如果对于具体模型太长时在对应模型上手动截取安全长度字符）
   */
  int AGENT_SYSTEM_PROMPT_MAX_LENGTH = 100000;

  /**
   * 智能体欢迎消息最大长度
   */
  int AGENT_WELCOME_MESSAGE_MAX_LENGTH = 1000;

  /**
   * 智能体记忆摘要提示词最大长度
   */
  int AGENT_SUMMARY_PROMPT_MAX_LENGTH = 2000;

  /**
   * 智能体建议问题最大数量
   */
  int AGENT_SUGGESTED_QUESTIONS_MAX_SIZE = 10;

  /**
   * 智能体关联知识库最大数量
   */
  int AGENT_KNOWLEDGE_BASE_IDS_MAX_SIZE = 5;

  /**
   * 智能体关联工具最大数量
   */
  int AGENT_TOOL_IDS_MAX_SIZE = 20;

  /**
   * 智能体关联技能最大数量
   */
  int AGENT_SKILL_IDS_MAX_SIZE = 20;

  /**
   * 智能体关联数据集最大数量
   */
  int AGENT_DATASET_IDS_MAX_SIZE = 5;

  /**
   * 智能体关联接口集最大数量
   */
  int AGENT_API_COLLECTION_IDS_MAX_SIZE = 5;

  /**
   * 智能体记忆默认窗口大小
   */
  int AGENT_MEMORY_DEFAULT_WINDOW_SIZE = 20;

  /**
   * 智能体记忆默认最大Token数
   */
  int AGENT_MEMORY_DEFAULT_MAX_TOKENS = 8000;

  // ==================== 知识库常量 ====================

  String KNOWLEDGE_DOC_UPLOAD_BIZ_KEY = "angusAIKnowledgeBaseDocs";

  /**
   * 知识库标签最大数量
   */
  int KNOWLEDGE_BASE_TAGS_MAX_COUNT = 5;

  /**
   * 批量删除文档最大数量
   */
  int KNOWLEDGE_BASE_BATCH_DELETE_MAX_COUNT = 200;

  /**
   * 文档名称最大长度
   */
  int DOCUMENT_NAME_MAX_LENGTH = 200;

  /**
   * 错误信息最大长度
   */
  int DOCUMENT_ERROR_MESSAGE_MAX_LENGTH = 1000;

  /**
   * 文件路径最大长度
   */
  int DOCUMENT_FILE_PATH_MAX_LENGTH = 500;

  /**
   * 内容哈希最大长度
   */
  int DOCUMENT_CONTENT_HASH_MAX_LENGTH = 64;

  // ==================== 知识库配置相关常量 ====================

  /**
   * 分段大小最小值
   */
  int CHUNK_SIZE_MIN_VALUE = 100;

  /**
   * 分段大小最大值
   */
  int CHUNK_SIZE_MAX_VALUE = 2000;

  /**
   * 分段重叠最小值
   */
  int CHUNK_OVERLAP_MIN_VALUE = 0;

  /**
   * 分段重叠最大值
   */
  int CHUNK_OVERLAP_MAX_VALUE = 200;

  // ==================== 文档搜索相关常量 ====================

  /**
   * 搜索返回数量最小值
   */
  int SEARCH_LIMIT_MIN_VALUE = 1;

  /**
   * 搜索返回数量最大值
   */
  int SEARCH_LIMIT_MAX_VALUE = 20;

  /**
   * 相似度阈值最小值
   */
  double SIMILARITY_THRESHOLD_MIN_VALUE = 0.0;

  /**
   * 相似度阈值最大值
   */
  double SIMILARITY_THRESHOLD_MAX_VALUE = 1.0;

  // ==================== 数据集常量 ====================

  String DATASET_UPLOAD_BIZ_KEY = "angusAIDatasetFiles";

  /**
   * 数据集标签最大数量
   */
  int DATASET_TAGS_MAX_COUNT = 5;

  // ==================== 数据源常量 ====================

  /**
   * 数据源名称最大长度
   */
  int DATASOURCE_NAME_MAX_LENGTH = 50;

  /**
   * 数据库名称最大长度
   */
  int DATASOURCE_DATABASE_MAX_LENGTH = 255;

  /**
   * JDBC URL最大长度
   */
  int DATASOURCE_JDBC_URL_MAX_LENGTH = 500;

  /**
   * 数据库主机名或IP最大长度
   */
  int DATASOURCE_HOST_MAX_LENGTH = 255;

  /**
   * 数据库用户名最大长度
   */
  int DATASOURCE_USERNAME_MAX_LENGTH = 255;

  /**
   * 数据库密码最大长度
   */
  int DATASOURCE_PASSWORD_MAX_LENGTH = 4096;

  // ==================== 接口集常量 ====================

  int API_COLLECTION_MAX_FILE_MB = 20;
  int API_COLLECTION_MAX_FILE_BYTE = API_COLLECTION_MAX_FILE_MB * 1024 * 1024;

  String IMPORT_OPENAPI_DIR = "importApis" + File.separator + "openapi" + File.separator;
  String IMPORT_POSTMAN_DIR = "importApis" + File.separator + "postman" + File.separator;
  String EXPORT_OPENAPI_DIR = "exportApis" + File.separator;
}
