package cloud.xcan.angus.core.ai.application.query.sharing;

import java.util.Collection;
import java.util.Map;

public interface ResourceSharingAccessLogQuery {

  /**
   * 按用户ID批量统计访问共享资源的次数，key 为用户ID，value 为该用户的访问次数
   */
  Map<Long, Integer> getAccessCountMap(Collection<Long> userIds);
}
