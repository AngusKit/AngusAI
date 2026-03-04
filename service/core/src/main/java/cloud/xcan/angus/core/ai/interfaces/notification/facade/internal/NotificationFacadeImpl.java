package cloud.xcan.angus.core.ai.interfaces.notification.facade.internal;

import static cloud.xcan.angus.core.ai.interfaces.notification.facade.internal.assembler.NotificationAssembler.getSpecification;
import static cloud.xcan.angus.core.ai.interfaces.notification.facade.internal.assembler.NotificationAssembler.toCreateDomain;
import static cloud.xcan.angus.core.ai.interfaces.notification.facade.internal.assembler.NotificationAssembler.toDetailVo;
import static cloud.xcan.angus.core.ai.interfaces.notification.facade.internal.assembler.NotificationAssembler.toUpdateDomain;
import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;
import static cloud.xcan.angus.spec.principal.PrincipalContext.getUserId;

import cloud.xcan.angus.core.ai.application.cmd.notification.NotificationCmd;
import cloud.xcan.angus.core.ai.application.query.notification.NotificationQuery;
import cloud.xcan.angus.core.ai.domain.notification.Notification;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.NotificationFacade;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationArchiveDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationQueryDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationReadStatusDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationStarStatusDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.internal.assembler.NotificationAssembler;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.vo.BatchOperationResultVo;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.vo.NotificationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.vo.NotificationStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

/**
 * 通知门面服务实现
 */
@Component
public class NotificationFacadeImpl implements NotificationFacade {

  @Resource
  private NotificationCmd notificationCmd;

  @Resource
  private NotificationQuery notificationQuery;

  @Override
  public NotificationDetailVo create(NotificationCreateDto dto) {
    Notification notification = toCreateDomain(dto, getUserId());
    Notification saved = notificationCmd.create(notification);
    return toDetailVo(saved);
  }

  @Override
  public NotificationDetailVo update(Long id, NotificationUpdateDto dto) {
    Notification notification = toUpdateDomain(id, dto);
    Notification saved = notificationCmd.update(id, notification);
    return toDetailVo(saved);
  }

  @Override
  public BatchOperationResultVo updateReadStatus(NotificationReadStatusDto dto) {
    try {
      notificationCmd.updateReadStatus(dto.getNotificationIds(), dto.getIsRead());
      BatchOperationResultVo result = new BatchOperationResultVo();
      result.setSuccessCount(dto.getNotificationIds().size());
      result.setFailedCount(0);
      return result;
    } catch (Exception e) {
      BatchOperationResultVo result = new BatchOperationResultVo();
      result.setSuccessCount(0);
      result.setFailedCount(dto.getNotificationIds().size());
      return result;
    }
  }

  @Override
  public BatchOperationResultVo updateStarredStatus(NotificationStarStatusDto dto) {
    try {
      notificationCmd.updateStarredStatus(dto.getNotificationIds(), dto.getIsStarred());
      BatchOperationResultVo result = new BatchOperationResultVo();
      result.setSuccessCount(dto.getNotificationIds().size());
      result.setFailedCount(0);
      return result;
    } catch (Exception e) {
      BatchOperationResultVo result = new BatchOperationResultVo();
      result.setSuccessCount(0);
      result.setFailedCount(dto.getNotificationIds().size());
      return result;
    }
  }

  @Override
  public BatchOperationResultVo archive(NotificationArchiveDto dto) {
    try {
      notificationCmd.archive(dto.getNotificationIds());
      BatchOperationResultVo result = new BatchOperationResultVo();
      result.setSuccessCount(dto.getNotificationIds().size());
      result.setFailedCount(0);
      return result;
    } catch (Exception e) {
      BatchOperationResultVo result = new BatchOperationResultVo();
      result.setSuccessCount(0);
      result.setFailedCount(dto.getNotificationIds().size());
      return result;
    }
  }

  @Override
  public BatchOperationResultVo markAllAsRead() {
    int markedCount = notificationCmd.markAllAsRead();
    BatchOperationResultVo result = new BatchOperationResultVo();
    result.setSuccessCount(markedCount);
    result.setFailedCount(0);
    return result;
  }

  @Override
  public void delete(NotificationDeleteDto dto) {
    notificationCmd.delete(dto.getNotificationIds());
  }

  @Override
  public NotificationDetailVo getDetail(Long id) {
    Notification notification = notificationQuery.detail(id);
    return toDetailVo(notification);
  }

  @Override
  public PageResult<NotificationDetailVo> list(NotificationQueryDto dto) {
    dto.setTargetUserId(getUserId());
    Page<Notification> page = notificationQuery.list(
        getSpecification(dto), dto.tranPage(), dto.fullTextSearch,
        getMatchSearchFields(dto.getClass())
    );
    return buildVoPageResult(page, NotificationAssembler::toDetailVo);
  }

  @Override
  public NotificationStatisticsVo getStatistics() {
    return notificationQuery.getStatistics();
  }
}
