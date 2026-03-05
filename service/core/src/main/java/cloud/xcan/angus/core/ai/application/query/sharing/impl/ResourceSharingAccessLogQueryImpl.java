package cloud.xcan.angus.core.ai.application.query.sharing.impl;

import cloud.xcan.angus.core.ai.application.query.sharing.ResourceSharingAccessLogQuery;
import cloud.xcan.angus.core.ai.domain.sharing.ResourceSharingAccessLogRepo;
import jakarta.annotation.Resource;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ResourceSharingAccessLogQueryImpl implements ResourceSharingAccessLogQuery {

  @Resource
  private ResourceSharingAccessLogRepo resourceSharingAccessLogRepo;

  @Override
  public Map<Long, Integer> getAccessCountMap(Collection<Long> userIds) {
    if (userIds == null || userIds.isEmpty()) {
      return new HashMap<>();
    }
    List<Object[]> results = resourceSharingAccessLogRepo.countByUserIdIn(userIds);
    Map<Long, Integer> map = new HashMap<>();
    for (Long userId : userIds) {
      map.put(userId, 0);
    }
    for (Object[] row : results) {
      Long userId = ((Number) row[0]).longValue();
      int count = ((Number) row[1]).intValue();
      map.put(userId, count);
    }
    return map;
  }
}
