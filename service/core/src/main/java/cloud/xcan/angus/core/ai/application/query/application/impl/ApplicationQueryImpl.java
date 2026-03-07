package cloud.xcan.angus.core.ai.application.query.application.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.application.query.agent.AgentQuery;
import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.agent.Agent;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationRepo;
import cloud.xcan.angus.core.ai.domain.application.AIApplicationSearchRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.message.ProtocolException;
import cloud.xcan.angus.remote.message.http.ResourceNotFound;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Objects;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Service
public class ApplicationQueryImpl implements ApplicationQuery {

  @Resource
  private AIApplicationRepo applicationRepo;

  @Resource
  private AIApplicationSearchRepo applicationSearchRepo;

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private AgentQuery agentQuery;

  @Override
  public AIApplication findAndCheck(Long id) {
    return new BizTemplate<AIApplication>() {
      @Override
      protected AIApplication process() {
        return applicationRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("应用不存在", new Object[]{}));
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
        if (application.getAgentId() == null) {
          throw ProtocolException.of("应用未绑定智能体，请先配置应用");
        }
        // 从绑定的智能体获取模型
        agent = agentQuery.findAndCheck(application.getAgentId());
        if (nonNull(agent.getModelId())) {
          appDefaultModel = modelQuery.findAndCheck(agent.getModelId());
        }
        // 检查当前使用模型是否存在
        if (nonNull(currentUseModelId)) {
          currentUseMode = modelQuery.findAndCheck(currentUseModelId);
        }
        // 切换应用模型时，检查模型类型是否一致
        if (nonNull(currentUseModelId) && nonNull(agent.getModelId())
            && !Objects.equals(currentUseModelId, agent.getModelId())
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
  public AIApplication findByShareId(String shareId) {
    return new BizTemplate<AIApplication>() {
      @Override
      protected AIApplication process() {
        return applicationRepo.findByShareId(shareId).orElse(null);
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
  public long countByCreatedBy(Long createdBy) {
    return applicationRepo.countByCreatedBy(createdBy);
  }

  @Override
  public long countByStatus(ApplicationStatus status) {
    return applicationRepo.countByStatus(status);
  }

  @Override
  public Page<AIApplication> findPublicApplications(PageRequest pageable) {
    GenericSpecification<AIApplication> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("status", ApplicationStatus.PUBLISHED)));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<AIApplication> findByTemplateId(Long templateId, PageRequest pageable) {
    GenericSpecification<AIApplication> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("templateId", templateId)));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<AIApplication> findExpiredShareApplications(PageRequest pageable) {
    GenericSpecification<AIApplication> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.isNotNull("shareExpiresAt"),
            SearchCriteria.lessThanEqual("shareExpiresAt", LocalDateTime.now())));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<AIApplication> findByKnowledgeBaseId(Long knowledgeBaseId, PageRequest pageable) {
    GenericSpecification<AIApplication> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("knowledgeBaseId", knowledgeBaseId)));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<AIApplication> findByDatasetId(Long datasetId, PageRequest pageable) {
    GenericSpecification<AIApplication> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("datasetId", datasetId)));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<AIApplication> findByWorkflowId(Long workflowId, PageRequest pageable) {
    GenericSpecification<AIApplication> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("workflowId", workflowId)));
    return applicationRepo.findAll(specification, pageable);
  }
}
