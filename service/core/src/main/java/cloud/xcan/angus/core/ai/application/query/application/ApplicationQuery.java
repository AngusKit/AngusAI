package cloud.xcan.angus.core.ai.application.query.application;

import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface ApplicationQuery {

  /**
   * 查询应用并检查是否存在
   */
  Application findAndCheck(Long id);

  /**
   * 查询应用并检查应用和模型是否存在
   */
  Application findAndCheck(Long id, Long modelId);

  /**
   * 查询应用列表
   */
  Page<Application> find(GenericSpecification<Application> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 根据分享ID查询应用
   */
  Application findByShareId(String shareId);

  /**
   * 检查应用名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查应用名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 统计应用数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计指定状态的应用数量
   */
  long countByStatus(ApplicationStatus status);

  /**
   * 查询公开应用列表
   */
  Page<Application> findPublicApplications(PageRequest pageable);

  /**
   * 根据模板ID查询应用列表
   */
  Page<Application> findByTemplateId(Long templateId, PageRequest pageable);

  /**
   * 查询过期的分享应用
   */
  Page<Application> findExpiredShareApplications(PageRequest pageable);

  /**
   * 根据知识库ID查询关联的应用
   */
  Page<Application> findByKnowledgeBaseId(Long knowledgeBaseId, PageRequest pageable);

  /**
   * 根据数据集ID查询关联的应用
   */
  Page<Application> findByDatasetId(Long datasetId, PageRequest pageable);

  /**
   * 根据工作流ID查询关联的应用
   */
  Page<Application> findByWorkflowId(Long workflowId, PageRequest pageable);

}
