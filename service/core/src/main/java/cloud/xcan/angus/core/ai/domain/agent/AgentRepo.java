package cloud.xcan.angus.core.ai.domain.agent;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * 智能体仓储
 */
public interface AgentRepo extends BaseRepository<Agent, Long> {

  /**
   * 检查名称是否存在（同租户下）
   */
  boolean existsByName(String name);

  /**
   * 检查名称是否存在（排除指定ID）
   */
  boolean existsByNameAndIdNot(String name, Long id);

  /**
   * 根据状态查询
   */
  List<Agent> findByStatus(AgentStatus status);

  /**
   * 分页查询（关键词、状态、交互模式）
   */
  @Query("SELECT a FROM Agent a WHERE "
      + "(COALESCE(TRIM(:keyword), '') = '' OR a.name LIKE CONCAT('%', COALESCE(:keyword, ''), '%') OR a.description LIKE CONCAT('%', COALESCE(:keyword, ''), '%')) "
      + "AND (:status IS NULL OR a.status = :status) "
      + "AND (:interactionMode IS NULL OR a.interactionMode = :interactionMode)")
  Page<Agent> find(@Param("keyword") String keyword, @Param("status") AgentStatus status,
      @Param("interactionMode") InteractionMode interactionMode, Pageable pageable);
}
