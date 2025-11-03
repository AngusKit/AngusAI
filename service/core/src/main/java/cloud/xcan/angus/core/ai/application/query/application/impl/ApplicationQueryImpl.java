package cloud.xcan.angus.core.ai.application.query.application.impl;

import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationSearchRepo;
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
  private ApplicationRepo applicationRepo;

  @Resource
  private ApplicationSearchRepo applicationSearchRepo;

  @Resource
  private ModelQuery modelQuery;

  @Override
  public Application findAndCheck(Long id) {
    return new BizTemplate<Application>() {
      @Override
      protected Application process() {
        return applicationRepo.findById(id)
            .orElseThrow(() -> ResourceNotFound.of("应用不存在", new Object[]{}));
      }
    }.execute();
  }

  @Override
  public Application findAndCheck(Long id, @Nullable Long currentUseModelId) {
    return new BizTemplate<Application>() {
      Application application;
      Model currentUseMode;
      Model appDefaultModel;

      @Override
      protected void checkParams() {
        // 检查应用是否存在
        application = findAndCheck(id);

        // 检查应用模型是否存在
        if (nonNull(application.getModelId())) {
          appDefaultModel = modelQuery.findAndCheck(application.getModelId());
        }

        // 检查当前使用模型是否存在
        if (nonNull(currentUseModelId)) {
          currentUseMode = modelQuery.findAndCheck(currentUseModelId);
        }

        // 切换应用模型时，检查模型类型是否一致
        if (nonNull(currentUseModelId) && nonNull(application.getModelId())
            && !Objects.equals(currentUseModelId, application.getModelId())
            && !Objects.equals(currentUseMode.getType(),
            application.getAppDefaultModel().getType())) {
          throw ProtocolException.of("当前选择模型类型[{0}]与应用默认模型类型[{1}]不一致",
              new Object[]{currentUseMode.getType(), application.getAppDefaultModel().getType()});
        }
      }

      @Override
      protected Application process() {
        application.setAppDefaultModel(appDefaultModel);
        application.setCurrentUseMode(nullSafe(currentUseMode, appDefaultModel));
        return application;
      }
    }.execute();
  }

  @Override
  public Page<Application> find(GenericSpecification<Application> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return new BizTemplate<Page<Application>>() {
      @Override
      protected Page<Application> process() {
        return fullTextSearch
            ? applicationSearchRepo.find(spec.getCriteria(), pageable, Application.class, match)
            : applicationRepo.findAll(spec, pageable);
      }
    }.execute();
  }

  @Override
  public Application findByShareId(String shareId) {
    return new BizTemplate<Application>() {
      @Override
      protected Application process() {
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
  public Page<Application> findPublicApplications(PageRequest pageable) {
    GenericSpecification<Application> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("status", ApplicationStatus.PUBLISHED)));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<Application> findByTemplateId(Long templateId, PageRequest pageable) {
    GenericSpecification<Application> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("templateId", templateId)));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<Application> findExpiredShareApplications(PageRequest pageable) {
    GenericSpecification<Application> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.isNotNull("shareExpiresAt"),
            SearchCriteria.lessThanEqual("shareExpiresAt", LocalDateTime.now())));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<Application> findByKnowledgeBaseId(Long knowledgeBaseId, PageRequest pageable) {
    GenericSpecification<Application> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("knowledgeBaseId", knowledgeBaseId)));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<Application> findByDatasetId(Long datasetId, PageRequest pageable) {
    GenericSpecification<Application> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("datasetId", datasetId)));
    return applicationRepo.findAll(specification, pageable);
  }

  @Override
  public Page<Application> findByWorkflowId(Long workflowId, PageRequest pageable) {
    GenericSpecification<Application> specification = new GenericSpecification<>(
        SearchCriteria.criteria(SearchCriteria.equal("workflowId", workflowId)));
    return applicationRepo.findAll(specification, pageable);
  }
}
