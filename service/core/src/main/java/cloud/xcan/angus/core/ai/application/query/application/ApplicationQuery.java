package cloud.xcan.angus.core.ai.application.query.application;

import cloud.xcan.angus.core.ai.domain.application.AIApplication;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationCountVo;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface ApplicationQuery {

  /**
   * 根据ID查询应用（不存在时返回空）
   */
  Optional<AIApplication> findById(Long id);

  /**
   * 查询应用并检查是否存在
   */
  AIApplication findAndCheck(Long id);

  /**
   * 查询应用并检查应用和模型是否存在
   */
  AIApplication findAndCheck(Long id, Long currentUseModelId);

  /**
   * 查询应用列表
   */
  Page<AIApplication> find(GenericSpecification<AIApplication> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  /**
   * 获取应用数量统计（总数、草稿、已发布、已暂停、标星）
   */
  ApplicationCountVo getCounts();

  /**
   * 检查应用名称是否存在
   */
  boolean existsByName(String name);

  /**
   * 检查应用名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 获取应用绑定的默认智能体ID（优先 isDefault=true，否则按 sortOrder 取第一个）
   */
  Long getDefaultAgentId(Long applicationId);

  /**
   * 获取应用绑定的所有智能体ID列表（按 sortOrder 排序）
   */
  List<Long> getAgentIds(Long applicationId);

}
