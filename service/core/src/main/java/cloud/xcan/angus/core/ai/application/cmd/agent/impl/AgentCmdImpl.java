package cloud.xcan.angus.core.ai.application.cmd.agent.impl;

import cloud.xcan.agentx.core.agent.AgentRegistry;
import cloud.xcan.agentx.core.agent.definition.AgentDefinition;
import cloud.xcan.agentx.core.model.ModelRegistry;
import cloud.xcan.angus.core.ai.application.cmd.agent.AgentCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentRepo;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.application.converter.AgentDefinitionConverter;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class AgentCmdImpl extends CommCmd<Agent, Long> implements AgentCmd {

  @Resource
  private AgentRepo agentRepo;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private AgentRegistry agentRegistry;

  @Resource
  private ModelRegistry modelRegistry;

  @Resource
  private ModelQuery modelQuery;

  @Override
  @Transactional
  public Agent create(Agent agent) {
    return new BizTemplate<Agent>() {
      @Override
      protected void checkParams() {
        if (agentQuery.existsByName(agent.getName())) {
          throw ResourceExisted.of("智能体名称「{0}」已存在", new Object[]{agent.getName()});
        }
        modelQuery.findAndCheck(agent.getDefaultModelId());
      }

      @Override
      protected Agent process() {
        insert0(agent);
        return agent;
      }
    }.execute();
  }

  @Override
  @Transactional
  public Agent update(Agent agent) {
    return new BizTemplate<Agent>() {
      @Override
      protected void checkParams() {
        if (agentQuery.existsByNameAndIdNot(agent.getName(), agent.getId())) {
          throw ResourceExisted.of("智能体名称「{0}」已存在", new Object[]{agent.getName()});
        }
        if (agent.getDefaultModelId() != null) {
          modelQuery.findAndCheck(agent.getDefaultModelId());
        }
      }

      @Override
      protected Agent process() {
        return agentRepo.save(agent);
      }
    }.execute();
  }

  @Override
  @Transactional
  public Agent updateStatus(Long id, AgentStatus status) {
    return new BizTemplate<Agent>() {
      Agent agentDb;

      @Override
      protected void checkParams() {
        agentDb = agentQuery.findAndCheck(id);
      }

      @Override
      protected Agent process() {
        if (agentDb.getStatus().equals(status)) {
          return agentDb;
        }

        // 根据状态更新AgentRegistry
        if (AgentStatus.ACTIVE.equals(status)) {
          registerToRegistry(agentDb);
        } else {
          agentRegistry.unregister(String.valueOf(id));
        }

        agentDb.setStatus(status);
        return agentRepo.save(agentDb);
      }
    }.execute();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    new BizTemplate<Void>() {
      @Override
      protected void checkParams() {
        // 检查是否存在
        agentQuery.findAndCheck(id);

        // 检查是否被使用
        if (agentQuery.isReferencedByApplications(id)) {
          throw ProtocolException.of("智能体已被应用引用，无法删除。请先解除应用绑定");
        }
      }

      @Override
      protected Void process() {
        agentRegistry.unregister(String.valueOf(id));
        agentRepo.deleteById(id);
        return null;
      }
    }.execute();
  }

  /**
   * 将 Agent 注册到 AgentRegistry
   * TODO: 确认 ModelConfigProvider.loadById(String.valueOf(modelId)) 是否支持按模型ID加载
   */
  private void registerToRegistry(Agent agent) {
    Model model = modelQuery.findAndCheck(agent.getDefaultModelId());
    AgentDefinition definition = AgentDefinitionConverter.toDefinition(agent, model);
    String configId = String.valueOf(agent.getDefaultModelId());
    ChatModel chatModel;
    StreamingChatModel streamingModel = null;
    try {
      chatModel = modelRegistry.getChatModel(configId);
      streamingModel = modelRegistry.getStreamingChatModel(configId);
    } catch (Exception e) {
      log.warn("ModelRegistry.getChatModel({}) failed, fallback to provider default: {}", configId,
          e.getMessage());
      // 降级：使用 AgentDefinition 中的 provider 获取默认模型
      agentRegistry.register(definition);
      return;
    }
    agentRegistry.register(definition, chatModel, streamingModel);
  }

  @Override
  protected BaseRepository<Agent, Long> getRepository() {
    return this.agentRepo;
  }
}
