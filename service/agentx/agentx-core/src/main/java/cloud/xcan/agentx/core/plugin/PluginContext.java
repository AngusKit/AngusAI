package cloud.xcan.agentx.core.plugin;

import cloud.xcan.agentx.core.guardrail.InputGuardrail;
import cloud.xcan.agentx.core.guardrail.OutputGuardrail;
import cloud.xcan.agentx.core.model.ModelFactory;
import cloud.xcan.agentx.core.tool.ToolDescriptor;
import cloud.xcan.agentx.core.vectorstore.VectorStoreFactory;
import cloud.xcan.agentx.core.workflow.engine.NodeExecutor;
import dev.langchain4j.skills.Skill;

/**
 * 插件上下文 — 提供给插件在 init 阶段注册扩展组件的 API
 */
public interface PluginContext {

  /**
   * 注册工具
   */
  void registerTool(ToolDescriptor tool);

  /**
   * 注册输入护栏
   */
  void registerInputGuardrail(InputGuardrail guardrail);

  /**
   * 注册输出护栏
   */
  void registerOutputGuardrail(OutputGuardrail guardrail);

  /**
   * 注册工作流节点执行器
   */
  void registerNodeExecutor(NodeExecutor executor);

  /**
   * 注册模型工厂
   */
  void registerModelFactory(ModelFactory factory);

  /**
   * 注册向量存储工厂
   */
  void registerVectorStoreFactory(VectorStoreFactory factory);

  /**
   * 注册技能（LangChain4j Skill）
   */
  void registerSkill(Skill skill);

  /**
   * 获取插件配置值
   */
  <T> T getConfig(String key, Class<T> type);
}
