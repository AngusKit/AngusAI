package cloud.xcan.angus.core.ai.application.query.team;

import cloud.xcan.angus.api.commonlink.CombinedTargetType;
import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivitySummary;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface ActivityQuery {

  Page<Activity> find(GenericSpecification<Activity> spec, PageRequest pageable,
      boolean fullTextSearch, String[] match);

  List<ActivitySummary> findSummaryByTarget(CombinedTargetType targetType, Long targetId);

  int getActivityNumByMainTarget(Long id);

}




