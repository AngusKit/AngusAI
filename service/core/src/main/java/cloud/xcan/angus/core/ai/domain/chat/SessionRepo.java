package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.infra.jpa.common.BaseRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 会话仓储接口
 */
@Repository
public interface SessionRepo extends BaseRepository<Session, Long> {

  /**
   * 根据应用ID查询会话列表
   */
  List<Session> findByAppId(Long appId);

  /**
   * 根据模型ID查询会话列表
   */
  List<Session> findByModelId(Long modelId);

  /**
   * 查询用户的置顶会话
   */
  List<Session> findByCreatedByAndIsPinnedTrueOrderByLastModifiedDateDesc(Long userId);

  /**
   * 查询用户的收藏会话
   */
  List<Session> findByCreatedByAndIsStarredTrueOrderByLastModifiedDateDesc(Long userId);
}
