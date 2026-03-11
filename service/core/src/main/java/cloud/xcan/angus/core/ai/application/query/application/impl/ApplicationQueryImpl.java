package cloud.xcan.angus.core.ai.application.query.application.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationRepo;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationSearchRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgent;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStarRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationAgentRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationCountVo;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
public class ApplicationQueryImpl implements ApplicationQuery {

  @Resource
  private AIApplicationRepo applicationRepo;

  @Resource
  private ApplicationAgentRepo applicationAgentRepo;

  @Resource
  private AIApplicationSearchRepo applicationSearchRepo;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private AgentQuery agentQuery;

  @Resource
  private ApplicationStarRepo applicationStarRepo;

  @Override
  public Optional<AIApplication> findById(Long id) {
    return new BizTemplate<Optional<AIApplication>>() {
      @Override
      protected Optional<AIApplication> process() {
        return applicationRepo.findById(id);
      }
    }.execute();
  }

  @Override
  public AIApplication findAndCheck(Long id) {
    return new BizTemplate<AIApplication>() {
      @Override
      protected AIApplication process() {
        return applicationRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("应用「{0}」不存在", new Object[]{id}));
      }
    }.execute();
  }

  @Override
  public AIApplication findAndCheck(Long id, @Nullable Long currentUseModelId) {
    return new BizTemplate<AIApplication>() {
      AIApplication application;
      Agent agent;
      Model currentUseMode;
      Model appDefaultModel;

      @Override
      protected void checkParams() {
        // 检查应用是否存在
        application = findAndCheck(id);
        Long defaultAgentId = applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(id)
            .stream()
            .filter(b -> Boolean.TRUE.equals(b.getIsDefault()))
            .findFirst()
            .map(ApplicationAgent::getAgentId)
            .orElseGet(() -> {
              List<ApplicationAgent> list = applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(
                  id);
              return list.isEmpty() ? null : list.get(0).getAgentId();
            });
        if (defaultAgentId == null) {
          throw ProtocolException.of("应用未绑定智能体，请先配置应用");
        }
        // 从绑定的智能体获取模型
        agent = agentQuery.findAndCheck(defaultAgentId);
        if (nonNull(agent.getDefaultModelId())) {
          appDefaultModel = modelQuery.findAndCheck(agent.getDefaultModelId());
        }
        // 检查当前使用模型是否存在
        if (nonNull(currentUseModelId)) {
          currentUseMode = modelQuery.findAndCheck(currentUseModelId);
        }
        // 切换应用模型时，检查模型类型是否一致
        if (nonNull(currentUseModelId) && nonNull(agent.getDefaultModelId())
            && !Objects.equals(currentUseModelId, agent.getDefaultModelId())
            && nonNull(appDefaultModel)
            && !Objects.equals(currentUseMode.getType(), appDefaultModel.getType())) {
          throw ProtocolException.of("当前选择模型类型[{0}]与智能体默认模型类型[{1}]不一致",
              new Object[]{currentUseMode.getType(), appDefaultModel.getType()});
        }
      }

      @Override
      protected AIApplication process() {
        application.setAppDefaultModel(appDefaultModel);
        application.setCurrentUseMode(nullSafe(currentUseMode, appDefaultModel));
        return application;
      }
    }.execute();
  }

  @Override
  public Page<AIApplication> find(GenericSpecification<AIApplication> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<AIApplication>>() {
      @Override
      protected Page<AIApplication> process() {
        return fullTextSearch
            ? applicationSearchRepo.find(spec.getCriteria(), pageable, AIApplication.class, match)
            : applicationRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public ApplicationCountVo getCounts() {
    return new BizTemplate<ApplicationCountVo>() {
      @Override
      protected ApplicationCountVo process() {
        Long userId = getUserId();
        long total = applicationRepo.countByCreatedBy(userId);
        long draft = applicationRepo.countByCreatedByAndStatus(userId, ApplicationStatus.DRAFT);
        long published = applicationRepo.countByCreatedByAndStatus(userId, ApplicationStatus.PUBLISHED);
        long paused = applicationRepo.countByCreatedByAndStatus(userId, ApplicationStatus.PAUSED);
        long starred = applicationStarRepo.countByUserId(userId);
        return ApplicationCountVo.builder()
            .total(total)
            .draft(draft)
            .published(published)
            .paused(paused)
            .starred(starred)
            .build();
      }
    }.execute();
  }

  @Override
  public boolean existsByName(String name) {
    return applicationRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return applicationRepo.existsByNameAndIdNot(name, id);
  }

  @Override
  public Long getDefaultAgentId(Long applicationId) {
    List<ApplicationAgent> list =
        applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(applicationId);
    if (list.isEmpty()) {
      return null;
    }
    return list.stream()
        .filter(b -> Boolean.TRUE.equals(b.getIsDefault()))
        .findFirst()
        .map(ApplicationAgent::getAgentId)
        .orElse(list.get(0).getAgentId());
  }

  @Override
  public List<Long> getAgentIds(Long applicationId) {
    return applicationAgentRepo.findByApplicationIdOrderBySortOrderAsc(applicationId).stream()
        .map(ApplicationAgent::getAgentId)
        .toList();
  }

}
