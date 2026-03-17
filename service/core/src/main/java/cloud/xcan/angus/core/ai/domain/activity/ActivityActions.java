package cloud.xcan.angus.core.ai.domain.activity;

/**
 * 活动消息常量定义，用于统一管理活动消息，方便后续国际化
 */
public interface ActivityActions {

  // ========== 应用相关 ==========
  String ACTIVITY_APPLICATION_CREATED = "activity.ai.application.created";
  String ACTIVITY_APPLICATION_UPDATED = "activity.ai.application.updated";
  String ACTIVITY_APPLICATION_DELETED = "activity.ai.application.deleted";
  String ACTIVITY_APPLICATION_DUPLICATED = "activity.ai.application.duplicated";
  String ACTIVITY_APPLICATION_PUBLISHED = "activity.ai.application.published";
  String ACTIVITY_APPLICATION_UNPUBLISHED = "activity.ai.application.unpublished";
  String ACTIVITY_APPLICATION_SHARED = "activity.ai.application.shared";
  String ACTIVITY_APPLICATION_STAR_ADDED = "activity.ai.application.star.added";
  String ACTIVITY_APPLICATION_STAR_REMOVED = "activity.ai.application.star.removed";
  String ACTIVITY_APPLICATION_CONFIG_UPDATED = "activity.ai.application.config.updated";
  /** 应用活动格式，参数：{0}=应用名称 */
  String ACTIVITY_APPLICATION_FORMAT = "activity.ai.application.format";
}
