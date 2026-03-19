package cloud.xcan.angus.core.ai.interfaces.activity.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.activity.Activity;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.dto.ActivityFindDto;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.ActivityDetailVo;
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
        .setActionType(activity.getActionType())
        .setStatus(activity.getStatus())
        .setResourceId(activity.getResourceId())
        .setResourceType(activity.getResourceType())
        .setResourceName(activity.getResourceName())
        .setActivityDate(activity.getActivityDate())
        .setIpAddress(activity.getIpAddress())
        .setUserAgent(activity.getUserAgent())
        .setDescription(activity.getDescription())
        .setDetail(activity.getDetail());
  }

  public static GenericSpecification<Activity> getSpecification(ActivityFindDto dto) {
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "activityDate")
        .matchSearchFields("resourceName", "userName", "detail")
        .inAndNotFields("resourceId", "resourceType", "actionType", "status")
        .orderByFields("id", "activityDate", "resourceType", "actionType", "status")
        .build();
    return new GenericSpecification<>(filters);
  }

}
