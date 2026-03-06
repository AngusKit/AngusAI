package com.agentx.core.plugin;

import com.agentx.core.guardrail.InputGuardrail;
import com.agentx.core.guardrail.OutputGuardrail;
import com.agentx.core.model.ModelFactory;
import com.agentx.core.skill.SkillDefinition;
import com.agentx.core.tool.ToolDescriptor;
import com.agentx.core.vectorstore.VectorStoreFactory;
import com.agentx.core.workflow.engine.NodeExecutor;

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
   * 注册技能定义
   */
  void registerSkill(SkillDefinition skill);

  /**
   * 获取插件配置值
   */
  <T> T getConfig(String key, Class<T> type);
}
