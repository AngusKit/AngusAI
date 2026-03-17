package cloud.xcan.angus.core.ai.application.cmd.activity.impl;

import static cloud.xcan.angus.core.spring.SpringContextHolder.getCachedUidGenerator;
import static cloud.xcan.angus.core.utils.PrincipalContextUtils.getOptTenantId;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;
import static cloud.xcan.angus.spec.utils.ObjectUtils.stringSafe;

import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.api.commonlink.Language;
import cloud.xcan.angus.api.manager.TenantManager;
import cloud.xcan.angus.api.manager.UserManager;
import cloud.xcan.angus.core.ai.application.cmd.activity.ActivityCmd;
import cloud.xcan.angus.core.ai.domain.activity.ActionType;
import cloud.xcan.angus.core.ai.domain.activity.Activity;
import cloud.xcan.angus.core.ai.domain.activity.ActivityRepo;
import cloud.xcan.angus.core.ai.domain.activity.ActivityStatus;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import cloud.xcan.angus.core.utils.PrincipalContextUtils;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 活动命令服务实现。参考 AngusGit 活动记录国际化定义，实现对 AngusAI 应用操作活动进行记录。
 */
@Service
public class ActivityCmdImpl extends CommCmd<Activity, Long> implements ActivityCmd {

  @Resource
  private ActivityRepo activityRepo;

  @Resource
  private MessageSource messageSource;

  @Resource
  private TenantManager tenantManager;

  @Resource
  private UserManager userManager;

  @Transactional(rollbackFor = Exception.class)
  @Override
  public void add(Activity activity) {
    if (!PrincipalContextUtils.isUserAction() || Objects.isNull(activity)) {
      return;
    }
    insert0(activity);
  }

  @Transactional(rollbackFor = Exception.class)
  @Override
  public void addAll(Collection<Activity> activities) {
    if (!PrincipalContextUtils.isUserAction() || activities == null || activities.isEmpty()) {
      return;
    }
    batchInsert0(activities);
  }

  @Transactional(rollbackFor = Exception.class)
  @Override
  public void deleteByTarget(FullResourceType resourceType, List<Long> resourceIds) {
    activityRepo.deleteByResourceIdAndResourceType(resourceIds, resourceType.name());
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void recordApplicationActivity(Long applicationId, String applicationName,
      String actionKey, Object... args) {
    if (!PrincipalContextUtils.isUserAction()) {
      return;
    }
    Long userId = getUserId();
    Object[] msgArgs = args != null && args.length > 0 ? args : new Object[]{stringSafe(applicationName, "")};
    String description = getMessage(userId, actionKey, msgArgs);
    Activity activity = new Activity()
        .setId(getCachedUidGenerator().getUID())
        .setResourceId(applicationId)
        .setResourceType(FullResourceType.APPLICATION)
        .setResourceName(stringSafe(applicationName, ""))
        .setUserId(nullSafe(userId, -1L))
        .setActionType(resolveActionType(actionKey))
        .setStatus(ActivityStatus.SUCCESS)
        .setActivityDate(LocalDateTime.now())
        .setDescription(description)
        .setDetail(description);
    activity.setTenantId(getOptTenantId());
    insert0(activity);
  }

  private ActionType resolveActionType(String actionKey) {
    if (actionKey == null) {
      return ActionType.UPDATE;
    }
    if (actionKey.contains("created") || actionKey.contains("duplicated")) {
      return ActionType.CREATE;
    }
    if (actionKey.contains("deleted")) {
      return ActionType.DELETE;
    }
    if (actionKey.contains("star")) {
      return ActionType.CONFIGURE;
    }
    return ActionType.UPDATE;
  }

  /**
   * 解析活动用户所属租户的 Locale，用于国际化消息。默认使用 Language.DEFAULT。
   */
  private Locale resolveLocale(Long userId) {
    if (tenantManager != null && userManager != null && userId != null && userId > 0) {
      Long tenantId = userManager.getCachedTenantId(getOptTenantId(), userId);
      if (tenantId != null) {
        return tenantManager.getCachedDefaultLanguage(tenantId).toLocale();
      }
    }
    return Language.DEFAULT.toLocale();
  }

  /**
   * 获取国际化消息，语言取自活动用户所属租户的配置
   */
  private String getMessage(Long userId, String key, Object... args) {
    return messageSource.getMessage(key, args != null ? args : new Object[]{}, key,
        resolveLocale(userId));
  }

  @Override
  protected BaseRepository<Activity, Long> getRepository() {
    return activityRepo;
  }
}
