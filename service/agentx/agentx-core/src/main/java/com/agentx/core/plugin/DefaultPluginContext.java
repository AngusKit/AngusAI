package com.agentx.core.plugin;

import com.agentx.core.guardrail.InputGuardrail;
import com.agentx.core.guardrail.OutputGuardrail;
import com.agentx.core.model.ModelFactory;
import com.agentx.core.skill.SkillDefinition;
import com.agentx.core.tool.ToolDescriptor;
import com.agentx.core.tool.ToolRegistry;
import com.agentx.core.vectorstore.VectorStoreFactory;
import com.agentx.core.workflow.engine.NodeExecutor;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

/**
 * 默认插件上下文实现 — 收集插件注册的扩展组件
 */
@Slf4j
public class DefaultPluginContext implements PluginContext {

  private final ToolRegistry toolRegistry;
  private final Map<String, Object> pluginConfig;

  private final List<InputGuardrail> inputGuardrails = new ArrayList<>();
  private final List<OutputGuardrail> outputGuardrails = new ArrayList<>();
  private final List<NodeExecutor> nodeExecutors = new ArrayList<>();
  private final List<ModelFactory> modelFactories = new ArrayList<>();
  private final List<VectorStoreFactory> vectorStoreFactories = new ArrayList<>();
  private final List<SkillDefinition> skillDefinitions = new ArrayList<>();

  public DefaultPluginContext(ToolRegistry toolRegistry, Map<String, Object> pluginConfig) {
    this.toolRegistry = toolRegistry;
    this.pluginConfig = pluginConfig != null ? pluginConfig : Map.of();
  }

  @Override
  public void registerTool(ToolDescriptor tool) {
    toolRegistry.register(tool);
    log.info("Plugin registered tool: {}", tool.getId());
  }

  @Override
  public void registerInputGuardrail(InputGuardrail guardrail) {
    inputGuardrails.add(guardrail);
    log.info("Plugin registered input guardrail: {}", guardrail.getClass().getSimpleName());
  }

  @Override
  public void registerOutputGuardrail(OutputGuardrail guardrail) {
    outputGuardrails.add(guardrail);
    log.info("Plugin registered output guardrail: {}", guardrail.getClass().getSimpleName());
  }

  @Override
  public void registerNodeExecutor(NodeExecutor executor) {
    nodeExecutors.add(executor);
    log.info("Plugin registered node executor for type: {}", executor.getNodeType());
  }

  @Override
  public void registerModelFactory(ModelFactory factory) {
    modelFactories.add(factory);
    log.info("Plugin registered model factory for provider: {}", factory.getProvider());
  }

  @Override
  public void registerVectorStoreFactory(VectorStoreFactory factory) {
    vectorStoreFactories.add(factory);
    log.info("Plugin registered vector store factory for type: {}", factory.getType());
  }

  @Override
  public void registerSkill(SkillDefinition skill) {
    skillDefinitions.add(skill);
    log.info("Plugin registered skill: {}", skill.getId());
  }

  @Override
  @SuppressWarnings("unchecked")
  public <T> T getConfig(String key, Class<T> type) {
    Object value = pluginConfig.get(key);
    if (value == null) {
      return null;
    }
    return type.cast(value);
  }

  // --- Accessors for PluginManager to retrieve registered extensions ---

  public List<InputGuardrail> getInputGuardrails() {
    return inputGuardrails;
  }

  public List<OutputGuardrail> getOutputGuardrails() {
    return outputGuardrails;
  }

  public List<NodeExecutor> getNodeExecutors() {
    return nodeExecutors;
  }

  public List<ModelFactory> getModelFactories() {
    return modelFactories;
  }

  public List<VectorStoreFactory> getVectorStoreFactories() {
    return vectorStoreFactories;
  }

  public List<SkillDefinition> getSkillDefinitions() {
    return skillDefinitions;
  }
}
