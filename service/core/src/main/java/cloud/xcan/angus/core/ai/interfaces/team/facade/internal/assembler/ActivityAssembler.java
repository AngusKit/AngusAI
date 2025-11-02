package cloud.xcan.angus.core.ai.interfaces.team.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.ai.interfaces.team.facade.dto.ActivityFindDto;
import cloud.xcan.angus.core.ai.interfaces.team.facade.vo.ActivityDetailVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class ActivityAssembler {

  public static ActivityDetailVo toDetailVo(Activity activity) {
    return new ActivityDetailVo()
        .setId(activity.getId())
        .setUserId(activity.getUserId())
        .setUserName(activity.getUserName())
        .setUserAvatar(activity.getUserAvatar())
        .setTargetId(activity.getTargetId())
        .setTargetType(activity.getTargetType())
        .setTargetName(activity.getTargetName())
        .setActivityDate(activity.getActivityDate())
        .setDescription(activity.getDescription())
        .setDetail(activity.getDetail());
  }

  public static GenericSpecification<Activity> getSpecification(ActivityFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "activityDate")
        .orderByFields("id", "activityDate")
        .matchSearchFields("targetName", "detail")
        .inAndNotFields("targetId", "targetType")
        .build();
    return new GenericSpecification<>(filters);
  }

}
