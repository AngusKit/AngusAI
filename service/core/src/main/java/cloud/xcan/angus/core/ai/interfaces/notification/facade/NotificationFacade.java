package cloud.xcan.angus.core.ai.interfaces.notification.facade;

import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationArchiveDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationCreateDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationQueryDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationReadStatusDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationStarStatusDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.dto.NotificationUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.vo.BatchOperationResultVo;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.vo.NotificationDetailVo;
import cloud.xcan.angus.core.ai.interfaces.notification.facade.vo.NotificationStatisticsVo;
import cloud.xcan.angus.remote.PageResult;

/**
 * 通知门面服务接口
 */
public interface NotificationFacade {

  NotificationDetailVo create(NotificationCreateDto dto);

  NotificationDetailVo update(Long id, NotificationUpdateDto dto);

  BatchOperationResultVo updateReadStatus(NotificationReadStatusDto dto);

  BatchOperationResultVo updateStarredStatus(NotificationStarStatusDto dto);

  BatchOperationResultVo archive(NotificationArchiveDto dto);

  BatchOperationResultVo markAllAsRead();

  void delete(NotificationDeleteDto dto);

  NotificationDetailVo getDetail(Long id);

  PageResult<NotificationDetailVo> list(NotificationQueryDto dto);

  NotificationStatisticsVo getStatistics();
}
