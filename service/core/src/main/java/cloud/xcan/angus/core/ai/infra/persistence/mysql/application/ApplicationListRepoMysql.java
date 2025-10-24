package cloud.xcan.angus.core.ai.infra.persistence.mysql.application;

import cloud.xcan.angus.core.ai.domain.application.Application;
import cloud.xcan.angus.core.ai.domain.application.ApplicationListRepo;
import cloud.xcan.angus.core.jpa.repository.AbstractSearchRepository;
import cloud.xcan.angus.core.jpa.repository.SearchMode;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.time.LocalDateTime;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicationListRepoMysql extends AbstractSearchRepository<Application>
    implements ApplicationListRepo {

  @Override
  public StringBuilder getSqlTemplate(SearchMode mode, Class<Application> mainClz,
      Set<SearchCriteria> criteria, String tableName, String... matches) {
    return getSqlTemplate0(mode, mainClz, criteria, "application", matches);
  }

  @Override
  public StringBuilder getSqlTemplate0(SearchMode mode, Class<Application> mainClz,
      Set<SearchCriteria> criteria, String tableName, String... matches) {
    StringBuilder sql = new StringBuilder("SELECT %s FROM " + tableName + " a WHERE 1=1 ");
    sql.append(getCriteriaAliasCondition(criteria, mainClz, "a", mode, false, matches));
    return sql;
  }

  @Override
  public String getReturnFieldsCondition(Set<SearchCriteria> criteria, Object[] params) {
    return "a.*";
  }

  /**
   * 查询公开应用列表
   */
  public Page<Application> findPublicApplications(Pageable pageable) {
    return findPublicApplications(pageable);
  }

  /**
   * 根据模板ID查询应用列表
   */
  public Page<Application> findByTemplateId(Long templateId, Pageable pageable) {
    return findByTemplateId(templateId, pageable);
  }

  /**
   * 查询过期的分享应用
   */
  public Page<Application> findExpiredShareApplications(LocalDateTime now, Pageable pageable) {
    return findExpiredShareApplications(now, pageable);
  }

  /**
   * 根据知识库ID查询关联的应用
   */
  public Page<Application> findByKnowledgeBaseId(Long knowledgeBaseId, Pageable pageable) {
    return findByKnowledgeBaseId(knowledgeBaseId, pageable);
  }

  /**
   * 根据数据集ID查询关联的应用
   */
  public Page<Application> findByDatasetId(Long datasetId, Pageable pageable) {
    return findByDatasetId(datasetId, pageable);
  }

  /**
   * 根据工作流ID查询关联的应用
   */
  public Page<Application> findByWorkflowId(Long workflowId, Pageable pageable) {
    return findByWorkflowId(workflowId, pageable);
  }
}
