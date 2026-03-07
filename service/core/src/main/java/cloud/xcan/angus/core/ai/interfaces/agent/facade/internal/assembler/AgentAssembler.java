package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentCreateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentListVo;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class AgentAssembler {

  public static Agent toDomain(AgentCreateDto dto) {
    Agent agent = new Agent();
    agent.setName(dto.getName());
    agent.setDescription(dto.getDescription());
    agent.setInteractionMode(nullSafe(dto.getInteractionMode()));
    agent.setReasoningStrategy(nullSafe(dto.getReasoningStrategy()));
    agent.setAutonomyLevel(nullSafe(dto.getAutonomyLevel()));
    agent.setModelId(dto.getModelId());
    agent.setSystemPrompt(dto.getSystemPrompt());
    agent.setWelcomeMessage(dto.getWelcomeMessage());
    agent.setSuggestedQuestions(nullSafe(dto.getSuggestedQuestions(), ArrayList::new));
    if (dto.getResources() != null) {
      agent.setKnowledgeBaseIds(nullSafe(dto.getResources().getKnowledgeBaseIds(), ArrayList::new));
      agent.setToolIds(nullSafe(dto.getResources().getToolIds(), ArrayList::new));
      agent.setWorkflowId(dto.getResources().getWorkflowId());
      agent.setSkillIds(nullSafe(dto.getResources().getSkillIds(), ArrayList::new));
      agent.setDatasetIds(nullSafe(dto.getResources().getDatasetIds(), ArrayList::new));
      agent.setApiCollectionIds(nullSafe(dto.getResources().getApiCollectionIds(), ArrayList::new));
    }
    if (dto.getMemory() != null) {
      agent.setMemoryStrategy(nullSafe(dto.getMemory().getStrategy()));
      agent.setMemoryWindowSize(nullSafe(dto.getMemory().getWindowSize()));
      agent.setMemoryMaxTokens(nullSafe(dto.getMemory().getMaxTokens()));
      agent.setMemorySummaryPrompt(dto.getMemory().getSummaryPrompt());
    }
    if (dto.getGuardrails() != null) {
      agent.setInputGuardrailIds(nullSafe(dto.getGuardrails().getInputGuardrailIds(), ArrayList::new));
      agent.setOutputGuardrailIds(nullSafe(dto.getGuardrails().getOutputGuardrailIds(), ArrayList::new));
    }
    agent.setVariables(nullSafe(dto.getVariables(), HashMap::new));
    return agent;
  }

  public static void mergeUpdate(Agent agent, AgentUpdateDto dto) {
    if (dto.getName() != null) {
      agent.setName(dto.getName());
    }
    if (dto.getDescription() != null) {
      agent.setDescription(dto.getDescription());
    }
    if (dto.getInteractionMode() != null) {
      agent.setInteractionMode(dto.getInteractionMode());
    }
    if (dto.getReasoningStrategy() != null) {
      agent.setReasoningStrategy(dto.getReasoningStrategy());
    }
    if (dto.getAutonomyLevel() != null) {
      agent.setAutonomyLevel(dto.getAutonomyLevel());
    }
    if (dto.getModelId() != null) {
      agent.setModelId(dto.getModelId());
    }
    if (dto.getSystemPrompt() != null) {
      agent.setSystemPrompt(dto.getSystemPrompt());
    }
    if (dto.getWelcomeMessage() != null) {
      agent.setWelcomeMessage(dto.getWelcomeMessage());
    }
    if (dto.getSuggestedQuestions() != null) {
      agent.setSuggestedQuestions(dto.getSuggestedQuestions());
    }
    if (dto.getResources() != null) {
      if (dto.getResources().getKnowledgeBaseIds() != null) {
        agent.setKnowledgeBaseIds(dto.getResources().getKnowledgeBaseIds());
      }
      if (dto.getResources().getToolIds() != null) {
        agent.setToolIds(dto.getResources().getToolIds());
      }
      if (dto.getResources().getWorkflowId() != null) {
        agent.setWorkflowId(dto.getResources().getWorkflowId());
      }
      if (dto.getResources().getSkillIds() != null) {
        agent.setSkillIds(dto.getResources().getSkillIds());
      }
      if (dto.getResources().getDatasetIds() != null) {
        agent.setDatasetIds(dto.getResources().getDatasetIds());
      }
      if (dto.getResources().getApiCollectionIds() != null) {
        agent.setApiCollectionIds(dto.getResources().getApiCollectionIds());
      }
    }
    if (dto.getMemory() != null) {
      if (dto.getMemory().getStrategy() != null) {
        agent.setMemoryStrategy(dto.getMemory().getStrategy());
      }
      if (dto.getMemory().getWindowSize() != null) {
        agent.setMemoryWindowSize(dto.getMemory().getWindowSize());
      }
      if (dto.getMemory().getMaxTokens() != null) {
        agent.setMemoryMaxTokens(dto.getMemory().getMaxTokens());
      }
      if (dto.getMemory().getSummaryPrompt() != null) {
        agent.setMemorySummaryPrompt(dto.getMemory().getSummaryPrompt());
      }
    }
    if (dto.getGuardrails() != null) {
      if (dto.getGuardrails().getInputGuardrailIds() != null) {
        agent.setInputGuardrailIds(dto.getGuardrails().getInputGuardrailIds());
      }
      if (dto.getGuardrails().getOutputGuardrailIds() != null) {
        agent.setOutputGuardrailIds(dto.getGuardrails().getOutputGuardrailIds());
      }
    }
    if (dto.getVariables() != null) {
      agent.setVariables(dto.getVariables());
    }
  }

  public static AgentDetailVo toDetailVo(Agent agent) {
    AgentDetailVo vo = new AgentDetailVo();
    vo.setId(agent.getId());
    vo.setName(agent.getName());
    vo.setDescription(agent.getDescription());
    vo.setStatus(agent.getStatus());
    vo.setInteractionMode(agent.getInteractionMode());
    vo.setReasoningStrategy(agent.getReasoningStrategy());
    vo.setAutonomyLevel(agent.getAutonomyLevel());
    vo.setModelId(agent.getModelId());
    vo.setSystemPrompt(agent.getSystemPrompt());
    vo.setWelcomeMessage(agent.getWelcomeMessage());
    vo.setSuggestedQuestions(agent.getSuggestedQuestions());
    vo.setKnowledgeBaseIds(agent.getKnowledgeBaseIds());
    vo.setToolIds(agent.getToolIds());
    vo.setWorkflowId(agent.getWorkflowId());
    vo.setSkillIds(agent.getSkillIds());
    vo.setDatasetIds(agent.getDatasetIds());
    vo.setApiCollectionIds(agent.getApiCollectionIds());
    vo.setMemoryStrategy(agent.getMemoryStrategy());
    vo.setMemoryWindowSize(agent.getMemoryWindowSize());
    vo.setMemoryMaxTokens(agent.getMemoryMaxTokens());
    vo.setInputGuardrailIds(agent.getInputGuardrailIds());
    vo.setOutputGuardrailIds(agent.getOutputGuardrailIds());
    vo.setVariables(agent.getVariables());
    vo.setTenantId(agent.getTenantId());
    vo.setCreatedBy(agent.getCreatedBy());
    vo.setCreatedDate(agent.getCreatedDate());
    vo.setModifiedBy(agent.getModifiedBy());
    vo.setModifiedDate(agent.getModifiedDate());
    return vo;
  }

  public static AgentListVo toListVo(Agent agent) {
    AgentListVo vo = new AgentListVo();
    vo.setId(agent.getId());
    vo.setName(agent.getName());
    vo.setDescription(agent.getDescription());
    vo.setStatus(agent.getStatus());
    vo.setInteractionMode(agent.getInteractionMode());
    vo.setModelId(agent.getModelId());
    vo.setTenantId(agent.getTenantId());
    vo.setCreatedBy(agent.getCreatedBy());
    vo.setCreatedDate(agent.getCreatedDate());
    vo.setModifiedBy(agent.getModifiedBy());
    vo.setModifiedDate(agent.getModifiedDate());
    return vo;
  }
}
