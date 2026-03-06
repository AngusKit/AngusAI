package cloud.xcan.core.plugin;

import cloud.xcan.core.guardrail.InputGuardrail;
import cloud.xcan.core.guardrail.OutputGuardrail;
import cloud.xcan.core.model.ModelFactory;
import cloud.xcan.core.tool.ToolDescriptor;
import cloud.xcan.core.tool.ToolRegistry;
import cloud.xcan.core.vectorstore.VectorStoreFactory;
import cloud.xcan.core.workflow.engine.NodeExecutor;
import cloud.xcan.core.skill.SkillRegistry;
import dev.langchain4j.skills.Skill;
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
  private final SkillRegistry skillRegistry;
  private final Map<String, Object> pluginConfig;

  private final List<InputGuardrail> inputGuardrails = new ArrayList<>();
  private final List<OutputGuardrail> outputGuardrails = new ArrayList<>();
  private final List<NodeExecutor> nodeExecutors = new ArrayList<>();
  private final List<ModelFactory> modelFactories = new ArrayList<>();
  private final List<VectorStoreFactory> vectorStoreFactories = new ArrayList<>();

  public DefaultPluginContext(ToolRegistry toolRegistry, SkillRegistry skillRegistry,
      Map<String, Object> pluginConfig) {
    this.toolRegistry = toolRegistry;
    this.skillRegistry = skillRegistry;
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
  public void registerSkill(Skill skill) {
    skillRegistry.register(skill);
    log.info("Plugin registered skill: {}", skill.name());
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
}
