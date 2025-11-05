package cloud.xcan.angus.api.commonlink;

public enum FullResourceType {
  APPLICATION,       // 应用
  WORKFLOW,          // 工作流
  KNOWLEDGE_BASE,    // 知识库
  DATASET,           // 数据集
  MODEL,             // 模型
  PROMPT,            // 提示词
  PLUGIN,            // 插件
  VECTOR_STORE,      // 向量存储
  API_COLLECTION,    // 接口集

  TEAM_MEMBER,       // 团队成员
  TEAM_SETTINGS,     // 团队设置
  RESOURCE_SHARDING, // 资源共享

  API_KEY,           // API密钥
  BILLING,           // 计费
}
