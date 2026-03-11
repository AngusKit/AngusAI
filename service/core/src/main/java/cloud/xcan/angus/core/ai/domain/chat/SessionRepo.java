package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 会话仓储接口
 */
@NoRepositoryBean
public interface SessionRepo extends BaseRepository<Session, Long> {

  /**
   * 根据会话ID(UUID)查询
   */
  Optional<Session> findBySessionId(String sessionId);

  /**
   * 根据会话ID(UUID)列表批量查询（用于 batchDelete 等）
   */
  List<Session> findBySessionIdIn(List<String> sessionIds);

  /**
   * 统计某用户创建的会话总数
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计某用户在某应用下的会话数量（用于配额校验）
   */
  long countByCreatedByAndAppId(Long createdBy, Long appId);

  /**
   * 统计创建时间在指定范围内的会话数
   */
  long countByCreatedDateBetween(LocalDateTime start, LocalDateTime end);

  /**
   * 统计应用的使用次数
   */
  long countByAppId(Long appId);

  /**
   * 按 appId 分组统计消息数（用于 Top 应用） 返回 List&lt;Object[]&gt;，[0]=appId, [1]=messageCount
   */
  @Query("SELECT s.appId, COUNT(m) FROM Message m, Session s WHERE m.sessionEntityId = s.id "
      + "GROUP BY s.appId ORDER BY COUNT(m) DESC")
  List<Object[]> countMessagesByAppId(org.springframework.data.domain.Pageable pageable);

  /**
   * 按 modelId 分组统计消息数（用于 Top 模型） 返回 List&lt;Object[]&gt;，[0]=modelId, [1]=messageCount
   */
  @Query("SELECT s.modelId, COUNT(m) FROM Message m, Session s WHERE m.sessionEntityId = s.id "
      + "GROUP BY s.modelId ORDER BY COUNT(m) DESC")
  List<Object[]> countMessagesByModelId(org.springframework.data.domain.Pageable pageable);

  /**
   * 批量删除消息
   */
  @Modifying
  int deleteByIdIn(List<Long> ids);
}
