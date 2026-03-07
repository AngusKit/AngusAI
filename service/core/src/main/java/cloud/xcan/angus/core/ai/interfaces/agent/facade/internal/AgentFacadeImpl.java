package cloud.xcan.angus.core.ai.interfaces.agent.facade.internal;


import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.agentx.core.agent.definition.AgentDefinition;
import cloud.xcan.agentx.core.model.ModelRegistry;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.AgentFacade;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentCreateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentFindDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.dto.AgentUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentAssembler;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.internal.assembler.AgentDefinitionAssembler;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentDetailVo;
import cloud.xcan.angus.core.ai.interfaces.agent.facade.vo.AgentListVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.message.ProtocolException;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

/**
 * 智能体门面实现
 */
@Slf4j
@Component
public class AgentFacadeImpl implements AgentFacade {

  @Resource
  private AgentCmd agentCmd;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private AgentRegistry agentRegistry;

  @Resource
  private ModelRegistry modelRegistry;

  @Resource
  private cloud.xcan.angus.core.ai.application.query.model.ModelQuery modelQuery;

  @NameJoin
  @Override
  public AgentDetailVo create(AgentCreateDto dto) {
    Agent agent = AgentAssembler.toDomain(dto);
    Agent saved = agentCmd.create(agent);
    return AgentAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public AgentDetailVo update(Long id, AgentUpdateDto dto) {
    Agent agentDb = agentQuery.findAndCheck(id);
    AgentStatus wasActive = agentDb.getStatus();
    AgentAssembler.mergeUpdate(agentDb, dto);
    Agent saved = agentCmd.update(agentDb);

    // 若原本已发布，需重新注册到 AgentRegistry
    if (wasActive == AgentStatus.ACTIVE) {
      try {
        agentRegistry.unregister(saved.getAgentId());
        registerToRegistry(saved);
      } catch (Exception e) {
        log.warn("Failed to re-register agent {} after update: {}", id, e.getMessage());
      }
    }
    return AgentAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public AgentDetailVo getDetail(Long id) {
    Agent agent = agentQuery.findAndCheck(id);
    return AgentAssembler.toDetailVo(agent);
  }

  @NameJoin
  @Override
  public PageResult<AgentListVo> list(AgentFindDto dto) {
    AgentStatus status = dto.getBindable() != null && dto.getBindable()
        ? AgentStatus.ACTIVE : dto.getStatus();
    Page<Agent> page = agentQuery.find(
        dto.getKeyword(),
        status,
        dto.getInteractionMode(),
        dto.tranPage()
    );
    return buildVoPageResult(page, AgentAssembler::toListVo);
  }

  @Override
  public void delete(Long id, boolean force) {
    Agent agent = agentQuery.findAndCheck(id);
    if (!force && agentQuery.isReferencedByApplications(id)) {
      throw ProtocolException.of("智能体已被应用引用，无法删除。请先解除应用绑定，或使用 force=true 强制删除。", new Object[]{});
    }
    if (agent.getStatus() == AgentStatus.ACTIVE) {
      try {
        agentRegistry.unregister(agent.getAgentId());
      } catch (Exception e) {
        log.warn("Failed to unregister agent {} before delete: {}", id, e.getMessage());
      }
    }
    agentCmd.delete(id, force);
  }

  @NameJoin
  @Override
  public AgentDetailVo updateStatus(Long id, AgentStatus status) {
    Agent agent = agentQuery.findAndCheck(id);
    AgentStatus oldStatus = agent.getStatus();

    if (status == AgentStatus.ACTIVE) {
      agentCmd.updateStatus(id, status);
      Agent updated = agentQuery.findAndCheck(id);
      registerToRegistry(updated);
      return AgentAssembler.toDetailVo(updated);
    } else {
      try {
        agentRegistry.unregister(agent.getAgentId());
      } catch (Exception e) {
        log.warn("Failed to unregister agent {}: {}", id, e.getMessage());
      }
      agentCmd.updateStatus(id, status);
      return AgentAssembler.toDetailVo(agentQuery.findAndCheck(id));
    }
  }

  /**
   * 将 Agent 注册到 AgentRegistry
   * TODO: 确认 ModelConfigProvider.loadById(String.valueOf(modelId)) 是否支持按模型ID加载
   */
  private void registerToRegistry(Agent agent) {
    cloud.xcan.angus.core.ai.domain.model.Model model = modelQuery.findAndCheck(agent.getModelId());
    AgentDefinition definition = AgentDefinitionAssembler.toDefinition(agent, model);
    String configId = String.valueOf(agent.getModelId());
    ChatModel chatModel;
    StreamingChatModel streamingModel = null;
    try {
      chatModel = modelRegistry.getChatModel(configId);
      streamingModel = modelRegistry.getStreamingChatModel(configId);
    } catch (Exception e) {
      log.warn("ModelRegistry.getChatModel({}) failed, fallback to provider default: {}", configId, e.getMessage());
      // 降级：使用 AgentDefinition 中的 provider 获取默认模型
      agentRegistry.register(definition);
      return;
    }
    agentRegistry.register(definition, chatModel, streamingModel);
  }
}
