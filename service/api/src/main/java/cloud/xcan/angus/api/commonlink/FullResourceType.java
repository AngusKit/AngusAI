package cloud.xcan.angus.api.commonlink;

public enum FullResourceType {
  APPLICATION,       // 应用
  AGENT,             // 智能体
  WORKFLOW,          // 工作流
  KNOWLEDGE_BASE,    // 知识库
  KNOWLEDGE_BASE_DOC,// 知识库文档
  DATASET,           // 数据集
  DATASET_DATA,      // 数据集数据
  MODEL,             // 模型
  PROMPT,            // 提示词
  PLUGIN,            // 插件
  VECTOR_STORE,      // 向量存储
  API_COLLECTION,    // 接口集

  TEAM_MEMBER,       // 团队成员
  TEAM_SETTINGS,     // 团队设置
  RESOURCE_SHARDING, // 资源共享

  API_KEY,           // API密钥
  BILLING,
  ;           // 计费

  public Object getMessage() {
    return null;
  }
}
