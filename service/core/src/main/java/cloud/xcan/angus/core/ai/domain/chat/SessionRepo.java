package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
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
   * 统计某用户在某应用下的会话数量（用于配额校验）
   */
  long countByCreatedByAndAppId(Long createdBy, Long appId);

  /**
   * 统计应用的使用次数
   */
  long countByAppId(Long appId);

  /**
   * 批量删除消息
   */
  @Modifying
  int deleteByIdIn(List<Long> ids);
}
