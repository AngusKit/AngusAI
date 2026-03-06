package cloud.xcan.core.plugin;

/**
 * 插件扩展点类型 — 定义插件可以扩展的系统能力
 */
public final class ExtensionPoints {

  private ExtensionPoints() {
  }

  /**
   * 工具扩展 — 插件可注册新的工具
   */
  public static final String TOOL = "tool";

  /**
   * 护栏扩展 — 插件可注册新的输入/输出护栏
   */
  public static final String GUARDRAIL = "guardrail";

  /**
   * 工作流节点扩展 — 插件可注册新的节点执行器
   */
  public static final String NODE_EXECUTOR = "node_executor";

  /**
   * 模型提供商扩展 — 插件可注册新的 ModelFactory
   */
  public static final String MODEL_PROVIDER = "model_provider";

  /**
   * 向量存储扩展 — 插件可注册新的 VectorStoreFactory
   */
  public static final String VECTOR_STORE = "vector_store";

  /**
   * 记忆策略扩展 — 插件可注册新的 ChatMemoryStore 实现
   */
  public static final String MEMORY_STORE = "memory_store";

  /**
   * 技能扩展 — 插件可注册新的 LangChain4j Skill
   */
  public static final String SKILL = "skill";
}
