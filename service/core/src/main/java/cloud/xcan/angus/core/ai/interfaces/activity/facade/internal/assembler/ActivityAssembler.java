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
    return new ActivityDetailVo().setId(activity.getId())
        .setProjectId(activity.getProjectId())
        .setProjectName(activity.getProjectName())
        .setUserId(activity.getUserId())
        .setFullName(activity.getFullName()).setAvatar(activity.getAvatar())
        .setTargetId(activity.getTargetId()).setTargetType(activity.getTargetType())
        .setTargetName(activity.getTargetName())
        .setParentTargetId(activity.getParentTargetId())
        .setOptDate(activity.getOptDate())
        .setDescription(activity.getDescription())
        .setDetail(activity.getDetail());
  }

  public static GenericSpecification<Activity> getSpecification(ActivityFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "optDate")
        .orderByFields("id", "optDate")
        .matchSearchFields("targetName", "detail")
        .inAndNotFields("mainTargetId", "parentTargetId", "targetId", "targetType")
        .build();
    return new GenericSpecification<>(filters);
  }

}
