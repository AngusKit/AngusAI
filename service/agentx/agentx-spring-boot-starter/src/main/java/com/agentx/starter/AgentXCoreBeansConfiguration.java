package com.agentx.starter;

import com.agentx.core.agent.AgentRegistry;
import com.agentx.core.agent.definition.AgentDefinitionParser;
import com.agentx.core.guardrail.GuardrailChain;
import com.agentx.core.memory.MemoryFactory;
import com.agentx.core.model.ModelConfigProvider;
import com.agentx.core.model.ModelFactory;
import com.agentx.core.model.ModelRegistry;
import com.agentx.core.multiagent.MultiAgentOrchestrator;
import com.agentx.core.plugin.AgentXPlugin;
import com.agentx.core.plugin.PluginManager;
import com.agentx.core.prompt.PromptManager;
import com.agentx.core.skill.Skill;
import com.agentx.core.skill.SkillRegistry;
import com.agentx.core.tool.ToolRegistry;
import com.agentx.core.tool.ToolScanner;
import com.agentx.core.vectorstore.VectorStoreConfigProvider;
import com.agentx.core.vectorstore.VectorStoreFactory;
import com.agentx.core.vectorstore.VectorStoreRegistry;
import com.agentx.core.workflow.dsl.WorkflowDslParser;
import com.agentx.core.workflow.engine.NodeExecutor;
import com.agentx.core.workflow.engine.WorkflowEngine;
import com.agentx.core.workflow.expression.ExpressionEngine;
import com.agentx.core.workflow.node.AgentNodeExecutor;
import com.agentx.core.workflow.node.CodeNodeExecutor;
import com.agentx.core.workflow.node.ConditionNodeExecutor;
import com.agentx.core.workflow.node.EndNodeExecutor;
import com.agentx.core.workflow.node.HttpNodeExecutor;
import com.agentx.core.workflow.node.KnowledgeRetrievalNodeExecutor;
import com.agentx.core.workflow.node.LlmNodeExecutor;
import com.agentx.core.workflow.node.LoopNodeExecutor;
import com.agentx.core.workflow.node.ParallelNodeExecutor;
import com.agentx.core.workflow.node.SetVariableNodeExecutor;
import com.agentx.core.workflow.node.StartNodeExecutor;
import com.agentx.core.workflow.node.SubWorkflowNodeExecutor;
import com.agentx.core.workflow.node.SwitchNodeExecutor;
import com.agentx.core.workflow.node.ToolNodeExecutor;
import com.agentx.core.workflow.node.WaitNodeExecutor;
import com.agentx.core.workflow.node.WhileNodeExecutor;
import com.agentx.core.workflow.validation.WorkflowSpecRegistry;
import com.agentx.core.workflow.validation.WorkflowValidator;
import dev.langchain4j.model.chat.ChatModel;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AgentX Core 模块 Bean 集中注册
 */
@Configuration
public class AgentXCoreBeansConfiguration {

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
    return new SkillRegistry(skills);
  }

  // ===== Memory =====
  @Bean
  public MemoryFactory memoryFactory(ObjectProvider<ChatModel> chatModelProvider) {
    Optional<ChatModel> chatModel = Optional.ofNullable(chatModelProvider.getIfAvailable());
    return new MemoryFactory(chatModel);
  }

  // ===== Agent =====
  @Bean
  public AgentDefinitionParser agentDefinitionParser() {
    return new AgentDefinitionParser();
  }

  @Bean
  public AgentRegistry agentRegistry(ToolRegistry toolRegistry, MemoryFactory memoryFactory,
      ModelRegistry modelRegistry, SkillRegistry skillRegistry) {
    return new AgentRegistry(toolRegistry, memoryFactory, modelRegistry, skillRegistry);
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
  public PluginManager pluginManager(ToolRegistry toolRegistry, List<AgentXPlugin> plugins) {
    return new PluginManager(toolRegistry, plugins);
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
  public SubWorkflowNodeExecutor subWorkflowNodeExecutor() {
    return new SubWorkflowNodeExecutor();
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
