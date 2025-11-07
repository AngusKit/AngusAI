package cloud.xcan.angus.core.ai.domain;

/**
 * 应用相关字段长度常量
 */
public interface Constants {

  /**
   * 应用名称最大长度
   */
  int APPLICATION_NAME_MAX_LENGTH = 50;

  /**
   * 应用描述最大长度
   */
  int APPLICATION_DESCRIPTION_MAX_LENGTH = 400;

  /**
   * 应用语言最大长度
   */
  int APPLICATION_LANGUAGE_MAX_LENGTH = 20;

  /**
   * 数据库描述字段长度
   */
  int APPLICATION_DESCRIPTION_DB_LENGTH = 500;

  // ==================== 知识库相关字段长度常量 ====================

  String KNOWLEDGE_DOC_UPLOAD_BIZ_KEY = "angusAIKnowledgeBaseDocs";

  /**
   * 知识库名称最大长度
   */
  int KNOWLEDGE_BASE_NAME_MAX_LENGTH = 50;

  /**
   * 知识库描述最大长度
   */
  int KNOWLEDGE_BASE_DESCRIPTION_MAX_LENGTH = 500;

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

}
