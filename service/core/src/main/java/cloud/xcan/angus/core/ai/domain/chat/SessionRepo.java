package cloud.xcan.angus.core.ai.domain.chat;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.NoRepositoryBean;

/**
 * 会话仓储接口
 */
@NoRepositoryBean
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

  /**
   * 查询用户的归档会话
   */
  List<Session> findByCreatedByAndIsArchivedTrueOrderByLastModifiedDateDesc(Long userId);

  /**
   * 查询用户最近创建的会话
   */
  Page<Session> findByCreatedByOrderByCreatedDateDesc(Long userId, Pageable pageable);

  /**
   * 查询用户最近活跃的会话
   */
  Page<Session> findByCreatedByOrderByLastModifiedDateDesc(Long userId, Pageable pageable);

  /**
   * 统计用户的会话数量
   */
  long countByCreatedBy(Long createdBy);

  /**
   * 统计应用的使用次数
   */
  long countByAppId(Long appId);

  /**
   * 统计模型的使用次数
   */
  long countByModelId(Long modelId);

  /**
   * 批量删除消息
   */
  int deleteByIdIn(List<Long> ids);
}
