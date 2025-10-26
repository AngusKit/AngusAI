package cloud.xcan.angus.core.ai.domain.workflow;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;

/**
 * 工作流仓储接口
 */
public interface WorkflowRepo extends BaseRepository<Workflow, Long> {

  // 当前为空接口，继承BaseRepository的基础CRUD方法
  // 后续可根据业务需求添加特定的查询、统计、修改、删除方法

}
