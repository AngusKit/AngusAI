package cloud.xcan.angus.core.ai.application.query.application.impl;

import cloud.xcan.angus.core.ai.application.query.application.ApplicationQuery;
import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationListRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationSearchRepo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ApplicationQueryImpl implements ApplicationQuery {

  @Resource
  private ApplicationRepo applicationRepo;

  @Resource
  private ApplicationSearchRepo applicationSearchRepo;

  @Resource
  private ApplicationListRepo applicationListRepo;

  @Override
  public Application findById(Long id) {
    return new BizTemplate<Application>() {
      @Override
      protected Application process() {
        return applicationRepo.findById(id).orElse(null);
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
            : applicationListRepo.find(spec.getCriteria(), pageable, Application.class, null);
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
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        return applicationRepo.existsByName(name);
      }
    }.execute();
  }

  @Override
  public boolean existsByNameAndCreatedByAndIdNot(String name, Long createdBy, Long id) {
    return new BizTemplate<Boolean>() {
      @Override
      protected Boolean process() {
        return applicationRepo.existsByNameAndCreatedByAndIdNot(name, createdBy, id);
      }
    }.execute();
  }

  @Override
  public long countByCreatedBy(Long createdBy) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return applicationRepo.countByCreatedBy(createdBy);
      }
    }.execute();
  }

  @Override
  public long countByStatus(ApplicationStatus status) {
    return new BizTemplate<Long>() {
      @Override
      protected Long process() {
        return applicationRepo.countByStatus(status);
      }
    }.execute();
  }

  @Override
  public Page<Application> findPublicApplications(PageRequest pageable) {
    return new BizTemplate<Page<Application>>() {
      @Override
      protected Page<Application> process() {
        GenericSpecification<Application> specification = new GenericSpecification<>(
            SearchCriteria.criteria(SearchCriteria.equal("status", ApplicationStatus.PUBLISHED)));
        return applicationRepo.findAll(specification, pageable);
      }
    }.execute();
  }

  @Override
  public Page<Application> findByTemplateId(Long templateId, PageRequest pageable) {
    return new BizTemplate<Page<Application>>() {
      @Override
      protected Page<Application> process() {
        GenericSpecification<Application> specification = new GenericSpecification<>(
            SearchCriteria.criteria(SearchCriteria.equal("templateId", templateId)));
        return applicationRepo.findAll(specification, pageable);
      }
    }.execute();
  }

  @Override
  public Page<Application> findExpiredShareApplications(PageRequest pageable) {
    return new BizTemplate<Page<Application>>() {
      @Override
      protected Page<Application> process() {
        GenericSpecification<Application> specification = new GenericSpecification<>(
            SearchCriteria.criteria(SearchCriteria.isNotNull("shareExpiresAt"),
                SearchCriteria.lessThanEqual("shareExpiresAt", LocalDateTime.now())));
        return applicationRepo.findAll(specification, pageable);
      }
    }.execute();
  }

  @Override
  public Page<Application> findByKnowledgeBaseId(Long knowledgeBaseId, PageRequest pageable) {
    return new BizTemplate<Page<Application>>() {
      @Override
      protected Page<Application> process() {
        GenericSpecification<Application> specification = new GenericSpecification<>(
            SearchCriteria.criteria(SearchCriteria.equal("knowledgeBaseId", knowledgeBaseId)));
        return applicationRepo.findAll(specification, pageable);
      }
    }.execute();
  }

  @Override
  public Page<Application> findByDatasetId(Long datasetId, PageRequest pageable) {
    return new BizTemplate<Page<Application>>() {
      @Override
      protected Page<Application> process() {
        GenericSpecification<Application> specification = new GenericSpecification<>(
            SearchCriteria.criteria(SearchCriteria.equal("datasetId", datasetId)));
        return applicationRepo.findAll(specification, pageable);
      }
    }.execute();
  }

  @Override
  public Page<Application> findByWorkflowId(Long workflowId, PageRequest pageable) {
    return new BizTemplate<Page<Application>>() {
      @Override
      protected Page<Application> process() {
        GenericSpecification<Application> specification = new GenericSpecification<>(
            SearchCriteria.criteria(SearchCriteria.equal("workflowId", workflowId)));
        return applicationRepo.findAll(specification, pageable);
      }
    }.execute();
  }
}
