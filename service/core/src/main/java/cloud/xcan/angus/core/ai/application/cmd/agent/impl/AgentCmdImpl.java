package cloud.xcan.angus.core.ai.application.cmd.agent.impl;

import cloud.xcan.angus.core.ai.application.cmd.agent.AgentCmd;
import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.agent.AgentRepo;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.remote.message.http.ResourceExisted;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AgentCmdImpl extends CommCmd<Agent, Long> implements AgentCmd {

  @Resource
  private AgentRepo agentRepo;

  @Resource
  private AgentQuery agentQuery;

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
        modelQuery.findAndCheck(agent.getModelId());
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
        agentQuery.findAndCheck(agent.getId());
        if (agentQuery.existsByNameAndIdNot(agent.getName(), agent.getId())) {
          throw ResourceExisted.of("智能体名称「{0}」已存在", new Object[]{agent.getName()});
        }
        if (agent.getModelId() != null) {
          modelQuery.findAndCheck(agent.getModelId());
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
        agentQuery.findAndCheck(id);
        // TODO: 检查是否被应用引用，若 force=false 则禁止删除
      }

      @Override
      protected Void process() {
        delete0(id);
        return null;
      }
    }.execute();
  }

  @Override
  protected BaseRepository<Agent, Long> repository() {
    return agentRepo;
  }
}
