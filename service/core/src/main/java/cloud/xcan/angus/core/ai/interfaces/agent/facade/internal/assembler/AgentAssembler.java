package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_MEMORY_DEFAULT_MAX_TOKENS;
import static cloud.xcan.angus.core.ai.domain.Constants.AGENT_MEMORY_DEFAULT_WINDOW_SIZE;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Collections.emptyList;
import static java.util.Collections.emptyMap;

import cloud.xcan.agentx.core.agent.enums.AutonomyLevel;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.agent.enums.ReasoningStrategy;
import cloud.xcan.agentx.core.memory.enums.MemoryStrategy;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentCreateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentFindDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo.ResourceInfoVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class AgentAssembler {

  public static Agent toDomain(AgentCreateDto dto) {
    Agent agent = new Agent();
    agent.setName(dto.getName());
    agent.setEncoding(dto.getEncoding());
    agent.setDescription(dto.getDescription());
    agent.setInteractionMode(nullSafe(dto.getInteractionMode(), InteractionMode.CHATBOT));
    agent.setReasoningStrategy(
        nullSafe(dto.getReasoningStrategy(), ReasoningStrategy.FUNCTION_CALLING));
    agent.setAutonomyLevel(nullSafe(dto.getAutonomyLevel(), AutonomyLevel.ASSISTANT));
    agent.setDefaultModelId(dto.getDefaultModelId());
    agent.setSystemPrompt(dto.getSystemPrompt());
    agent.setWelcomeMessage(dto.getWelcomeMessage());
    agent.setSuggestedQuestions(nullSafe(dto.getSuggestedQuestions(), emptyList()));
    if (dto.getResources() != null) {
      agent.setKnowledgeBaseIds(nullSafe(dto.getResources().getKnowledgeBaseIds(), emptyList()));
      agent.setToolIds(nullSafe(dto.getResources().getToolIds(), emptyList()));
      agent.setWorkflowId(dto.getResources().getWorkflowId());
      agent.setSkillIds(nullSafe(dto.getResources().getSkillIds(), emptyList()));
      agent.setDatasetIds(nullSafe(dto.getResources().getDatasetIds(), emptyList()));
      agent.setApiCollectionIds(nullSafe(dto.getResources().getApiCollectionIds(), emptyList()));
    }
    if (dto.getMemory() != null) {
      agent.setMemoryStrategy(nullSafe(dto.getMemory().getStrategy(), MemoryStrategy.TOKEN_WINDOW));
      agent.setMemoryWindowSize(
          nullSafe(dto.getMemory().getWindowSize(), AGENT_MEMORY_DEFAULT_WINDOW_SIZE));
      agent.setMemoryMaxTokens(
          nullSafe(dto.getMemory().getMaxTokens(), AGENT_MEMORY_DEFAULT_MAX_TOKENS));
      agent.setMemorySummaryPrompt(dto.getMemory().getSummaryPrompt());
    }
    if (dto.getGuardrails() != null) {
      agent.setInputGuardrailIds(nullSafe(dto.getGuardrails().getInputGuardrailIds(), emptyList()));
      agent.setOutputGuardrailIds(
          nullSafe(dto.getGuardrails().getOutputGuardrailIds(), emptyList()));
    }
    agent.setVariables(nullSafe(dto.getVariables(), emptyMap()));
    return agent;
  }

  public static void mergeUpdate(Agent agent, AgentUpdateDto dto) {
    agent.setName(dto.getName());
    agent.setEncoding(dto.getEncoding());
    agent.setDescription(dto.getDescription());
    agent.setInteractionMode(nullSafe(dto.getInteractionMode(), InteractionMode.CHATBOT));
    agent.setReasoningStrategy(
        nullSafe(dto.getReasoningStrategy(), ReasoningStrategy.FUNCTION_CALLING));
    agent.setAutonomyLevel(nullSafe(dto.getAutonomyLevel(), AutonomyLevel.ASSISTANT));
    agent.setDefaultModelId(dto.getDefaultModelId());
    agent.setSystemPrompt(dto.getSystemPrompt());
    agent.setWelcomeMessage(dto.getWelcomeMessage());
    agent.setSuggestedQuestions(nullSafe(dto.getSuggestedQuestions(), emptyList()));
    if (dto.getResources() != null) {
      agent.setKnowledgeBaseIds(nullSafe(dto.getResources().getKnowledgeBaseIds(), emptyList()));
      agent.setToolIds(nullSafe(dto.getResources().getToolIds(), emptyList()));
      agent.setWorkflowId(dto.getResources().getWorkflowId());
      agent.setSkillIds(nullSafe(dto.getResources().getSkillIds(), emptyList()));
      agent.setDatasetIds(nullSafe(dto.getResources().getDatasetIds(), emptyList()));
      agent.setApiCollectionIds(nullSafe(dto.getResources().getApiCollectionIds(), emptyList()));
    } else {
      agent.setKnowledgeBaseIds(emptyList());
      agent.setToolIds(emptyList());
      agent.setWorkflowId(null);
      agent.setSkillIds(emptyList());
      agent.setDatasetIds(emptyList());
      agent.setApiCollectionIds(emptyList());
    }
    if (dto.getMemory() != null) {
      agent.setMemoryStrategy(nullSafe(dto.getMemory().getStrategy(), MemoryStrategy.TOKEN_WINDOW));
      agent.setMemoryWindowSize(
          nullSafe(dto.getMemory().getWindowSize(), AGENT_MEMORY_DEFAULT_WINDOW_SIZE));
      agent.setMemoryMaxTokens(
          nullSafe(dto.getMemory().getMaxTokens(), AGENT_MEMORY_DEFAULT_MAX_TOKENS));
      agent.setMemorySummaryPrompt(dto.getMemory().getSummaryPrompt());
    } else {
      agent.setMemoryStrategy(MemoryStrategy.TOKEN_WINDOW);
      agent.setMemoryWindowSize(AGENT_MEMORY_DEFAULT_WINDOW_SIZE);
      agent.setMemoryMaxTokens(AGENT_MEMORY_DEFAULT_MAX_TOKENS);
      agent.setMemorySummaryPrompt(null);
    }
    if (dto.getGuardrails() != null) {
      agent.setInputGuardrailIds(nullSafe(dto.getGuardrails().getInputGuardrailIds(), emptyList()));
      agent.setOutputGuardrailIds(
          nullSafe(dto.getGuardrails().getOutputGuardrailIds(), emptyList()));
    } else {
      agent.setInputGuardrailIds(emptyList());
      agent.setOutputGuardrailIds(emptyList());
    }
    agent.setVariables(nullSafe(dto.getVariables(), emptyMap()));
  }

  public static AgentDetailVo toDetailVo(Agent agent, AgentDetailVo.AgentResourcesVo resources,
      AgentDetailVo.ResourceInfoVo defaultModel) {
    AgentDetailVo vo = toDetailVo(agent);
    if (resources != null) {
      vo.setResources(resources);
    }
    if (defaultModel != null) {
      vo.setDefaultModel(defaultModel);
    }
    return vo;
  }

  public static AgentDetailVo toDetailVo(Agent agent) {
    AgentDetailVo vo = new AgentDetailVo();
    vo.setId(agent.getId());
    vo.setName(agent.getName());
    vo.setEncoding(agent.getEncoding());
    vo.setDescription(agent.getDescription());
    vo.setStatus(agent.getStatus());
    vo.setInteractionMode(agent.getInteractionMode());
    vo.setReasoningStrategy(agent.getReasoningStrategy());
    vo.setAutonomyLevel(agent.getAutonomyLevel());
    vo.setSystemPrompt(agent.getSystemPrompt());
    vo.setWelcomeMessage(agent.getWelcomeMessage());
    vo.setSuggestedQuestions(agent.getSuggestedQuestions());

    // 关联智能体能力
    vo.setToolIds(agent.getToolIds());
    vo.setSkillIds(agent.getSkillIds());

    // 智能体配置
    vo.setMemoryStrategy(agent.getMemoryStrategy());
    vo.setMemoryWindowSize(agent.getMemoryWindowSize());
    vo.setMemoryMaxTokens(agent.getMemoryMaxTokens());
    vo.setMemorySummaryPrompt(agent.getMemorySummaryPrompt());
    vo.setInputGuardrailIds(agent.getInputGuardrailIds());
    vo.setOutputGuardrailIds(agent.getOutputGuardrailIds());
    vo.setVariables(agent.getVariables());

    // 设置审计字段
    vo.setTenantId(agent.getTenantId());
    vo.setCreatedBy(agent.getCreatedBy());
    vo.setCreatedDate(agent.getCreatedDate());
    vo.setModifiedBy(agent.getModifiedBy());
    vo.setModifiedDate(agent.getModifiedDate());
    return vo;
  }

  public static AgentListVo toListVo(Agent agent, ResourceInfoVo defaultModel) {
    AgentListVo vo = new AgentListVo();
    vo.setId(agent.getId());
    vo.setName(agent.getName());
    vo.setEncoding(agent.getEncoding());
    vo.setDescription(agent.getDescription());
    vo.setStatus(agent.getStatus());
    vo.setInteractionMode(agent.getInteractionMode());
    vo.setDefaultModel(defaultModel);

    // 设置审计字段
    vo.setTenantId(agent.getTenantId());
    vo.setCreatedBy(agent.getCreatedBy());
    vo.setCreatedDate(agent.getCreatedDate());
    vo.setModifiedBy(agent.getModifiedBy());
    vo.setModifiedDate(agent.getModifiedDate());
    return vo;
  }

  public static GenericSpecification<Agent> getSpecification(AgentFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .matchSearchFields("name", "description")
        .orderByFields("id", "name", "createdDate", "status")
        .build();
    return new GenericSpecification<>(filters);
  }
}
