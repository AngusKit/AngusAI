package cloud.xcan.angus.core.ai.application.cmd.team;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import java.util.Collection;
import java.util.List;

public interface ActivityCmd {

  void add(Activity activity);

  void addAll(Collection<Activity> activities);

  void deleteByTarget(FullResourceType targetType, List<Long> targetIds);

}




