package cloud.xcan.angus.core.ai.application.query.workflow;

import cloud.xcan.angus.core.ai.domain.workflow.Workflow;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface WorkflowQuery {

  /**
   * 查询并验证工作流是否存在
   */
  Workflow findAndCheck(Long id);

  /**
   * 查询工作流列表
   */
  Page<Workflow> find(GenericSpecification<Workflow> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 检查工作流名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查工作流名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

}
