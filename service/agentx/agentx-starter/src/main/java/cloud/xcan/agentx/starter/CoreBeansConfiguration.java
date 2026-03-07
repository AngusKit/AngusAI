package cloud.xcan.agentx.starter;

import cloud.xcan.core.agent.AgentRegistry;
import cloud.xcan.core.agent.definition.AgentDefinitionParser;
import cloud.xcan.core.agent.multi.MultiAgentOrchestrator;
import cloud.xcan.core.guardrail.GuardrailChain;
import cloud.xcan.core.knowledge.ContentRetrieverFactory;
import cloud.xcan.core.memory.InMemoryChatMemoryStore;
import cloud.xcan.core.memory.MemoryFactory;
import cloud.xcan.core.model.ModelConfigProvider;
import cloud.xcan.core.model.ModelFactory;
import cloud.xcan.core.model.ModelRegistry;
import cloud.xcan.core.plugin.AgentXPlugin;
import cloud.xcan.core.plugin.PluginManager;
import cloud.xcan.core.prompt.PromptManager;
import cloud.xcan.core.skill.SkillRegistry;
import cloud.xcan.core.tool.ToolRegistry;
import cloud.xcan.core.tool.ToolScanner;
import cloud.xcan.core.vectorstore.VectorStoreConfigProvider;
import cloud.xcan.core.vectorstore.VectorStoreFactory;
import cloud.xcan.core.vectorstore.VectorStoreRegistry;
import cloud.xcan.core.workflow.InMemoryWorkflowDefinitionProvider;
import cloud.xcan.core.workflow.WorkflowDefinitionProvider;
import cloud.xcan.core.workflow.dsl.WorkflowDslParser;
import cloud.xcan.core.workflow.engine.NodeExecutor;
import cloud.xcan.core.workflow.engine.WorkflowEngine;
import cloud.xcan.core.workflow.expression.ExpressionEngine;
import cloud.xcan.core.workflow.node.AgentNodeExecutor;
import cloud.xcan.core.workflow.node.CodeNodeExecutor;
import cloud.xcan.core.workflow.node.ConditionNodeExecutor;
import cloud.xcan.core.workflow.node.EndNodeExecutor;
import cloud.xcan.core.workflow.node.HttpNodeExecutor;
import cloud.xcan.core.workflow.node.KnowledgeRetrievalNodeExecutor;
import cloud.xcan.core.workflow.node.LlmNodeExecutor;
import cloud.xcan.core.workflow.node.LoopNodeExecutor;
import cloud.xcan.core.workflow.node.ParallelNodeExecutor;
import cloud.xcan.core.workflow.node.SetVariableNodeExecutor;
import cloud.xcan.core.workflow.node.StartNodeExecutor;
import cloud.xcan.core.workflow.node.SubWorkflowNodeExecutor;
import cloud.xcan.core.workflow.node.SwitchNodeExecutor;
import cloud.xcan.core.workflow.node.ToolNodeExecutor;
import cloud.xcan.core.workflow.node.WaitNodeExecutor;
import cloud.xcan.core.workflow.node.WhileNodeExecutor;
import cloud.xcan.core.workflow.validation.WorkflowSpecRegistry;
import cloud.xcan.core.workflow.validation.WorkflowValidator;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.skills.Skill;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import java.util.List;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

/**
 * AgentX Core 模块 Bean 集中注册
 */
@Configuration
public class CoreBeansConfiguration {

  // ===== Model =====
  @Bean
  public ModelRegistry modelRegistry(List<ModelFactory> factories,
      ModelConfigProvider configProvider) {
    return new ModelRegistry(factories, configProvider);
  }

  // ===== Vector Store =====
  @Bean
  public VectorStoreRegistry vectorStoreRegistry(List<VectorStoreFactory> factories,
      VectorStoreConfigProvider configProvider) {
    return new VectorStoreRegistry(factories, configProvider);
  }

  @Bean
  @ConditionalOnBean(VectorStoreRegistry.class)
  public ContentRetrieverFactory contentRetrieverFactory(VectorStoreRegistry vectorStoreRegistry,
      ModelRegistry modelRegistry) {
    return new ContentRetrieverFactory(vectorStoreRegistry, modelRegistry);
  }

  // ===== Tool =====
  @Bean
  public ToolRegistry toolRegistry() {
    return new ToolRegistry();
  }

  @Bean
  public ToolScanner toolScanner(ApplicationContext applicationContext, ToolRegistry toolRegistry) {
    return new ToolScanner(applicationContext, toolRegistry);
  }

  // ===== Skill =====
  @Bean
  public SkillRegistry skillRegistry(List<Skill> skills) {
    return new SkillRegistry(skills != null ? skills : List.of());
  }

  // ===== Memory =====
  @Bean
  @ConditionalOnMissingBean
  public ChatMemoryStore chatMemoryStore() {
    return new InMemoryChatMemoryStore();
  }

  @Bean
  public MemoryFactory memoryFactory(ChatMemoryStore chatMemoryStore, ModelRegistry modelRegistry) {
    return new MemoryFactory(chatMemoryStore, modelRegistry.getDefaultChatModel().orElse(null));
  }

  // ===== Agent =====
  @Bean
  public AgentDefinitionParser agentDefinitionParser() {
    return new AgentDefinitionParser();
  }

  @Bean
  public AgentRegistry agentRegistry(ToolRegistry toolRegistry, MemoryFactory memoryFactory,
      ModelRegistry modelRegistry, SkillRegistry skillRegistry, GuardrailChain guardrailChain,
      ObjectProvider<ContentRetrieverFactory> contentRetrieverFactoryProvider,
      @Lazy WorkflowEngine workflowEngine, WorkflowDefinitionProvider workflowDefinitionProvider) {
    ContentRetrieverFactory contentRetrieverFactory = contentRetrieverFactoryProvider.getIfAvailable();
    return new AgentRegistry(toolRegistry, memoryFactory, modelRegistry, skillRegistry,
        guardrailChain, contentRetrieverFactory, workflowEngine, workflowDefinitionProvider);
  }

  // ===== Guardrail =====
  @Bean
  public GuardrailChain guardrailChain() {
    return new GuardrailChain();
  }

  // ===== Multi-Agent =====
  @Bean
  public MultiAgentOrchestrator multiAgentOrchestrator(AgentRegistry agentRegistry) {
    return new MultiAgentOrchestrator(agentRegistry);
  }

  // ===== Prompt =====
  @Bean
  public PromptManager promptManager() {
    return new PromptManager();
  }

  // ===== Plugin =====
  @Bean
  public PluginManager pluginManager(ToolRegistry toolRegistry, SkillRegistry skillRegistry,
      List<AgentXPlugin> plugins) {
    return new PluginManager(toolRegistry, skillRegistry, plugins);
  }

  // ===== Workflow: Expression =====
  @Bean
  public ExpressionEngine expressionEngine() {
    return new ExpressionEngine();
  }

  // ===== Workflow: Parser =====
  @Bean
  public WorkflowDslParser workflowDslParser() {
    return new WorkflowDslParser();
  }

  // ===== Workflow: Provider =====
  @Bean
  public WorkflowDefinitionProvider workflowDefinitionProvider() {
    return new InMemoryWorkflowDefinitionProvider();
  }

  // ===== Workflow: Validation =====
  @Bean
  public WorkflowValidator workflowValidator() {
    return new WorkflowValidator();
  }

  @Bean
  public WorkflowSpecRegistry workflowSpecRegistry() {
    return new WorkflowSpecRegistry();
  }

  // ===== Workflow: Node Executors =====
  @Bean
  public StartNodeExecutor startNodeExecutor() {
    return new StartNodeExecutor();
  }

  @Bean
  public EndNodeExecutor endNodeExecutor() {
    return new EndNodeExecutor();
  }

  @Bean
  @ConditionalOnBean(ChatModel.class)
  public LlmNodeExecutor llmNodeExecutor(ChatModel chatModel) {
    return new LlmNodeExecutor(chatModel);
  }

  @Bean
  public AgentNodeExecutor agentNodeExecutor(AgentRegistry agentRegistry) {
    return new AgentNodeExecutor(agentRegistry);
  }

  @Bean
  public ToolNodeExecutor toolNodeExecutor(ToolRegistry toolRegistry) {
    return new ToolNodeExecutor(toolRegistry);
  }

  @Bean
  public HttpNodeExecutor httpNodeExecutor() {
    return new HttpNodeExecutor();
  }

  @Bean
  public CodeNodeExecutor codeNodeExecutor() {
    return new CodeNodeExecutor();
  }

  @Bean
  public ConditionNodeExecutor conditionNodeExecutor() {
    return new ConditionNodeExecutor();
  }

  @Bean
  public SwitchNodeExecutor switchNodeExecutor() {
    return new SwitchNodeExecutor();
  }

  @Bean
  public LoopNodeExecutor loopNodeExecutor() {
    return new LoopNodeExecutor();
  }

  @Bean
  public WhileNodeExecutor whileNodeExecutor() {
    return new WhileNodeExecutor();
  }

  @Bean
  public ParallelNodeExecutor parallelNodeExecutor() {
    return new ParallelNodeExecutor();
  }

  @Bean
  public WaitNodeExecutor waitNodeExecutor() {
    return new WaitNodeExecutor();
  }

  @Bean
  public SubWorkflowNodeExecutor subWorkflowNodeExecutor(@Lazy WorkflowEngine workflowEngine,
      WorkflowDefinitionProvider workflowDefinitionProvider, ExpressionEngine expressionEngine) {
    return new SubWorkflowNodeExecutor(workflowEngine, workflowDefinitionProvider,
        expressionEngine);
  }

  @Bean
  public SetVariableNodeExecutor setVariableNodeExecutor() {
    return new SetVariableNodeExecutor();
  }

  @Bean
  public KnowledgeRetrievalNodeExecutor knowledgeRetrievalNodeExecutor() {
    return new KnowledgeRetrievalNodeExecutor();
  }

  // ===== Workflow: Engine =====
  @Bean
  public WorkflowEngine workflowEngine(ExpressionEngine expressionEngine,
      List<NodeExecutor> executors) {
    return new WorkflowEngine(expressionEngine, executors);
  }
}
