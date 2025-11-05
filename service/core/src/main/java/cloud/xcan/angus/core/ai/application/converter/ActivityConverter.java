package cloud.xcan.angus.core.ai.application.converter;

import static cloud.xcan.angus.spec.experimental.Assert.assertTrue;
import static cloud.xcan.angus.spec.locale.MessageHolder.message;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getDefaultLanguage;
import static cloud.xcan.angus.spec.utils.ObjectUtils.isEmpty;
import static java.util.Objects.nonNull;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.domain.team.activity.Activity;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivityResource;
import cloud.xcan.angus.core.ai.domain.team.activity.ActivitySummary;
import cloud.xcan.angus.core.ai.domain.team.activity.ActionType;
import cloud.xcan.angus.spec.locale.EnumValueMessage;
import cloud.xcan.angus.spec.principal.Principal;
import cloud.xcan.angus.spec.principal.PrincipalContext;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ActivityConverter {

  public static <T extends ActivityResource> Activity toActivity(FullResourceType targetType,
      T resource, ActionType activityType, Object... params) {
    return createActivity(targetType, resource, activityType, PrincipalContext.get(), params);
  }

  public static List<Activity> toActivities(FullResourceType targetType,
      List<? extends ActivityResource> resources, ActionType activityType,
      List<Object[]> params) {
    Principal principal = PrincipalContext.get();
    Long tenantId = nonNull(principal.getTenantId()) ? principal.getTenantId() : -1L;
    List<Activity> activities = new ArrayList<>(resources.size());
    for (int i = 0; i < resources.size(); i++) {
      Activity activity = createActivity(targetType, resources.get(i), activityType,
          principal, params.get(i));
      activity.setTenantId(tenantId);
      activities.add(activity);
    }
    return activities;
  }

  public static List<Activity> toActivities(FullResourceType targetType,
      List<? extends ActivityResource> resources, ActionType activityType, Object... params) {
    Principal principal = PrincipalContext.get();
    Long tenantId = nonNull(principal.getTenantId()) ? principal.getTenantId() : -1L;
    List<Activity> activities = new ArrayList<>(resources.size());
    for (ActivityResource resource : resources) {
      Activity activity = createActivity(targetType, resource, activityType, principal, params);
      activity.setTenantId(tenantId);
      activities.add(activity);
    }
    return activities;
  }

  /**
   * Support max three parameters, need to keep order
   *
   * @param params The last parameter is the resource name
   */
  private static Activity createActivity(FullResourceType targetType, ActivityResource resource,
      ActionType activityType, Principal principal, Object[] params) {
    Activity activity = new Activity().setType(activityType)
        .setResourceType(targetType)
        .setUserId(principal.getUserId())
        .setActivityDate(LocalDateTime.now())
        .setDescription(getDescription(targetType, activityType, params))
        .setDetail(getDetail(targetType, resource, activityType, params));
    activity.setTenantId(principal.getTenantId());
    if (nonNull(resource)) {
      activity.setResourceId(resource.getId())
          .setResourceName(resource.getName());
    }
    return activity;
  }

  /**
   * The resource name does not need to be displayed in the description activity.
   */
  private static String getDescription(FullResourceType targetType, ActionType activityType,
      Object[] params) {
    if (isEmpty(params)) {
      return message(activityType.getDescMessageKey(),
          new Object[]{targetType.getMessage()}, getDefaultLanguage().toLocale());
    }

    assertTrue(params.length <= 2, "Support max two parameters");
    if (params.length == 1) {
      // Move the resource name to the front
      return message(activityType.getDescMessageKey(),
          new Object[]{targetType.getMessage(), safeEnumString(params[0])
              , getDefaultLanguage().toLocale()});
    }
    // Move the resource name to the front
    return message(activityType.getDescMessageKey(),
        new Object[]{targetType.getMessage(), safeEnumString(params[0]),
            safeEnumString(params[1])}, getDefaultLanguage().toLocale());
  }

  /**
   * The resource name needs to be displayed in the detail activity.
   * <p>
   * Set the resource name to the second parameter position.
   */
  private static String getDetail(FullResourceType targetType, ActivityResource resource,
      ActionType activityType, Object[] params) {
    if (isEmpty(params)) {
      return message(activityType.getDetailMessageKey(),
          new Object[]{targetType.getMessage(), "[" + resource.getName() + "]"
              , getDefaultLanguage().toLocale()});
    }
    assertTrue(params.length <= 2, "Support max two parameters");
    if (params.length == 1) {
      // Move the resource name to the front
      return message(activityType.getDetailMessageKey(),
          new Object[]{targetType.getMessage(), "[" + resource.getName() + "]",
              safeEnumString(params[0])},
          getDefaultLanguage().toLocale());
    }
    // Move the resource name to the front
    return message(activityType.getDetailMessageKey(),
        new Object[]{targetType.getMessage(), "[" + resource.getName() + "]",
            safeEnumString(params[0]), safeEnumString(params[1])}, getDefaultLanguage().toLocale());
  }

  private static String safeEnumString(Object param) {
    if (param instanceof EnumValueMessage) {
      return ((EnumValueMessage<?>) param).getMessage();
    }
    return param.toString();
  }

  public static List<String[]> activityParams(Collection<? extends ActivityResource> resources) {
    List<String[]> params = new ArrayList<>(resources.size());
    for (ActivityResource resource : resources) {
      params.add(new String[]{"[" + resource.getName() + "]"});
    }
    return params;
  }

  public static ActivitySummary toActivitySummary(Activity activity) {
    return new ActivitySummary().setId(activity.getId())
        .setUserId(activity.getUserId())
        .setUserName(activity.getUserName())
        .setUserAvatar(activity.getUserAvatar())
        .setTargetId(activity.getResourceId())
        .setTargetType(activity.getResourceType())
        .setTargetName(activity.getResourceName())
        .setActivityDate(activity.getActivityDate())
        .setDescription(activity.getDescription())
        .setDetail(activity.getDetail());
  }
}
