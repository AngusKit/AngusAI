package cloud.xcan.angus.core.ai.domain.activity;

/**
 * 活动消息常量定义，用于统一管理活动消息，方便后续国际化
 */
public interface ActivityActions {

  // ========== 应用相关 ==========
  String ACTIVITY_APPLICATION_CREATED = "activity.ai.application.created";
  String ACTIVITY_APPLICATION_UPDATED = "activity.ai.application.updated";
  String ACTIVITY_APPLICATION_DELETED = "activity.ai.application.deleted";
  String ACTIVITY_APPLICATION_DUPLICATED = "activity.ai.application.duplicated";
  String ACTIVITY_APPLICATION_PUBLISHED = "activity.ai.application.published";
  String ACTIVITY_APPLICATION_UNPUBLISHED = "activity.ai.application.unpublished";
  String ACTIVITY_APPLICATION_SHARED = "activity.ai.application.shared";
  String ACTIVITY_APPLICATION_STAR_ADDED = "activity.ai.application.star.added";
  String ACTIVITY_APPLICATION_STAR_REMOVED = "activity.ai.application.star.removed";
  String ACTIVITY_APPLICATION_CONFIG_UPDATED = "activity.ai.application.config.updated";
  /** 应用活动格式，参数：{0}=应用名称 */
  String ACTIVITY_APPLICATION_FORMAT = "activity.ai.application.format";

  // ========== 智能体相关 ==========
  String ACTIVITY_AGENT_CREATED = "activity.ai.agent.created";
  String ACTIVITY_AGENT_UPDATED = "activity.ai.agent.updated";
  String ACTIVITY_AGENT_DELETED = "activity.ai.agent.deleted";
  String ACTIVITY_AGENT_STATUS_UPDATED = "activity.ai.agent.status.updated";

  // ========== 工作流相关 ==========
  String ACTIVITY_WORKFLOW_CREATED = "activity.ai.workflow.created";
  String ACTIVITY_WORKFLOW_UPDATED = "activity.ai.workflow.updated";
  String ACTIVITY_WORKFLOW_DELETED = "activity.ai.workflow.deleted";
  String ACTIVITY_WORKFLOW_CLONED = "activity.ai.workflow.cloned";
  String ACTIVITY_WORKFLOW_CONFIG_UPDATED = "activity.ai.workflow.config.updated";
  String ACTIVITY_WORKFLOW_VISIBILITY_UPDATED = "activity.ai.workflow.visibility.updated";
  String ACTIVITY_WORKFLOW_STARTED = "activity.ai.workflow.started";
  String ACTIVITY_WORKFLOW_STOPPED = "activity.ai.workflow.stopped";

  // ========== 模型相关 ==========
  String ACTIVITY_MODEL_CREATED = "activity.ai.model.created";
  String ACTIVITY_MODEL_UPDATED = "activity.ai.model.updated";
  String ACTIVITY_MODEL_DELETED = "activity.ai.model.deleted";
  String ACTIVITY_MODEL_CONFIG_UPDATED = "activity.ai.model.config.updated";
  String ACTIVITY_MODEL_STATUS_UPDATED = "activity.ai.model.status.updated";

  // ========== 知识库相关 ==========
  String ACTIVITY_KNOWLEDGE_BASE_CREATED = "activity.ai.knowledgebase.created";
  String ACTIVITY_KNOWLEDGE_BASE_UPDATED = "activity.ai.knowledgebase.updated";
  String ACTIVITY_KNOWLEDGE_BASE_DELETED = "activity.ai.knowledgebase.deleted";
  String ACTIVITY_KNOWLEDGE_BASE_TOGGLED = "activity.ai.knowledgebase.toggled";
  String ACTIVITY_KNOWLEDGE_BASE_VISIBILITY_UPDATED = "activity.ai.knowledgebase.visibility.updated";

  // ========== 知识库文档相关 ==========
  String ACTIVITY_KNOWLEDGE_BASE_DOC_UPLOADED = "activity.ai.knowledgebase.doc.uploaded";
  String ACTIVITY_KNOWLEDGE_BASE_DOC_REPROCESSED = "activity.ai.knowledgebase.doc.reprocessed";
  String ACTIVITY_KNOWLEDGE_BASE_DOC_TOGGLED = "activity.ai.knowledgebase.doc.toggled";
  String ACTIVITY_KNOWLEDGE_BASE_DOC_DELETED = "activity.ai.knowledgebase.doc.deleted";
  String ACTIVITY_KNOWLEDGE_BASE_DOC_BATCH_DELETED = "activity.ai.knowledgebase.doc.batch.deleted";

  // ========== 数据集相关 ==========
  String ACTIVITY_DATASET_CREATED = "activity.ai.dataset.created";
  String ACTIVITY_DATASET_UPDATED = "activity.ai.dataset.updated";
  String ACTIVITY_DATASET_DELETED = "activity.ai.dataset.deleted";
  String ACTIVITY_DATASET_TOGGLED = "activity.ai.dataset.toggled";
  String ACTIVITY_DATASET_VISIBILITY_UPDATED = "activity.ai.dataset.visibility.updated";
  String ACTIVITY_DATASET_DATASOURCE_UPDATED = "activity.ai.dataset.datasource.updated";
  String ACTIVITY_DATASET_DATASOURCE_DELETED = "activity.ai.dataset.datasource.deleted";

  // ========== 数据集数据相关 ==========
  String ACTIVITY_DATASET_DATA_UPLOADED = "activity.ai.dataset.data.uploaded";
  String ACTIVITY_DATASET_DATA_SYNCED = "activity.ai.dataset.data.synced";
  String ACTIVITY_DATASET_DATA_BATCH_DELETED = "activity.ai.dataset.data.batch.deleted";

  // ========== 接口集相关 ==========
  String ACTIVITY_API_COLLECTION_CREATED = "activity.ai.apicollection.created";
  String ACTIVITY_API_COLLECTION_UPDATED = "activity.ai.apicollection.updated";
  String ACTIVITY_API_COLLECTION_DELETED = "activity.ai.apicollection.deleted";
  String ACTIVITY_API_COLLECTION_IMPORTED = "activity.ai.apicollection.imported";

  // ========== 提示词相关 ==========
  String ACTIVITY_PROMPT_CREATED = "activity.ai.prompt.created";
  String ACTIVITY_PROMPT_UPDATED = "activity.ai.prompt.updated";
  String ACTIVITY_PROMPT_DELETED = "activity.ai.prompt.deleted";
  String ACTIVITY_PROMPT_DUPLICATED = "activity.ai.prompt.duplicated";
  String ACTIVITY_PROMPT_FAVORITE_TOGGLED = "activity.ai.prompt.favorite.toggled";

  // ========== 分享相关 ==========
  String ACTIVITY_SHARING_CREATED = "activity.ai.sharing.created";
  String ACTIVITY_SHARING_UPDATED = "activity.ai.sharing.updated";
  String ACTIVITY_SHARING_DELETED = "activity.ai.sharing.deleted";
  String ACTIVITY_SHARING_TOGGLED = "activity.ai.sharing.toggled";

  // ========== 向量存储源相关 ==========
  String ACTIVITY_VECTOR_STORE_CREATED = "activity.ai.vectorstore.created";
  String ACTIVITY_VECTOR_STORE_UPDATED = "activity.ai.vectorstore.updated";
  String ACTIVITY_VECTOR_STORE_DELETED = "activity.ai.vectorstore.deleted";
  String ACTIVITY_VECTOR_STORE_TOGGLED = "activity.ai.vectorstore.toggled";
}
