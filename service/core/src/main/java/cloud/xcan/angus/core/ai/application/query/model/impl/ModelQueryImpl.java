package cloud.xcan.angus.core.ai.application.query.model.impl;

import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelProvider;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.domain.model.ModelType;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class ModelQueryImpl implements ModelQuery {

  @Resource
  private cloud.xcan.angus.core.ai.domain.model.ModelRepo modelRepo;

  @Override
  public Page<Model> find(GenericSpecification<Model> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match) {
    return modelRepo.find(spec, pageable, fullTextSearch, match);
  }

  @Override
  public Model findById(Long id) {
    return modelRepo.findById(id);
  }

  @Override
  public boolean existsByName(String name) {
    return modelRepo.existsByName(name);
  }

  @Override
  public boolean existsByNameAndIdNot(String name, Long id) {
    return modelRepo.existsByNameAndIdNot(name, id);
  }

  @Override
  public long countByCreatedBy(Long createdBy) {
    return modelRepo.countByCreatedBy(createdBy);
  }

  @Override
  public long countByStatus(ModelStatus status) {
    return modelRepo.countByStatus(status);
  }

  @Override
  public long countByType(ModelType type) {
    return modelRepo.countByType(type);
  }

  @Override
  public long countByProvider(ModelProvider provider) {
    return modelRepo.countByProvider(provider);
  }

  @Override
  public Page<Model> findRunningModels(PageRequest pageable) {
    return modelRepo.findByStatus(ModelStatus.RUNNING, pageable);
  }

  @Override
  public Page<Model> findStoppedModels(PageRequest pageable) {
    return modelRepo.findByStatus(ModelStatus.STOPPED, pageable);
  }

  @Override
  public Page<Model> findDeployingModels(PageRequest pageable) {
    return modelRepo.findByStatus(ModelStatus.DEPLOYING, pageable);
  }

  @Override
  public Page<Model> findByProvider(ModelProvider provider, PageRequest pageable) {
    return modelRepo.findByProvider(provider, pageable);
  }

  @Override
  public Page<Model> findByType(ModelType type, PageRequest pageable) {
    return modelRepo.findByType(type, pageable);
  }

  @Override
  public Page<Model> findRecentModels(PageRequest pageable) {
    return modelRepo.findRecentModels(pageable);
  }

  @Override
  public Page<Model> findMostCalledModels(PageRequest pageable) {
    return modelRepo.findMostCalledModels(pageable);
  }

  @Override
  public Page<Model> findHighestCostModels(PageRequest pageable) {
    return modelRepo.findHighestCostModels(pageable);
  }

  @Override
  public Model findByApiEndpoint(String apiEndpoint) {
    return modelRepo.findByApiEndpoint(apiEndpoint);
  }

  @Override
  public Page<Model> findExpiredModels(PageRequest pageable) {
    return modelRepo.findExpiredModels(pageable);
  }

  @Override
  public Page<Model> findIncompleteConfigModels(PageRequest pageable) {
    return modelRepo.findIncompleteConfigModels(pageable);
  }

  @Override
  public Page<Model> findErrorModels(PageRequest pageable) {
    return modelRepo.findByStatus(ModelStatus.ERROR, pageable);
  }

  @Override
  public Page<Model> findByVersion(String version, PageRequest pageable) {
    return modelRepo.findByVersion(version, pageable);
  }

  @Override
  public Page<Model> findModelsNeedingMonitoring(PageRequest pageable) {
    return modelRepo.findModelsNeedingMonitoring(pageable);
  }
}
