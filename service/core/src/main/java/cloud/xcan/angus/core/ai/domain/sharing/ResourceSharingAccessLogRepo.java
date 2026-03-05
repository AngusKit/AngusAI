package cloud.xcan.angus.core.ai.domain.sharing;

import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface ResourceSharingAccessLogRepo extends
    BaseRepository<ResourceSharingAccessLog, Long> {

  /**
   * 批量统计用户访问共享资源的次数，返回 [userId, count] 列表
   */
  @Query("SELECT l.userId, COUNT(l) FROM ResourceSharingAccessLog l WHERE l.userId IN :userIds GROUP BY l.userId")
  List<Object[]> countByUserIdIn(@Param("userIds") Collection<Long> userIds);
}
