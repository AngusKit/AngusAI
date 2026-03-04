package cloud.xcan.angus.core.ai.interfaces.notification;

import cloud.xcan.angus.core.ai.interfaces.notification.facade.NotificationFacade;
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
import cloud.xcan.angus.remote.ApiLocaleResult;
import cloud.xcan.angus.remote.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Notifications", description = "通知管理 - 通知的创建、查询、更新、状态更新、归档、删除等功能")
@Validated
@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationRest {

  @Resource
  private NotificationFacade notificationFacade;

  @Operation(operationId = "createNotification", summary = "创建通知", description = "创建新的系统通知")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "通知创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<NotificationDetailVo> create(
      @Valid @RequestBody NotificationCreateDto dto) {
    return ApiLocaleResult.success(notificationFacade.create(dto));
  }

  @Operation(operationId = "updateNotification", summary = "更新通知", description = "更新通知内容")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PutMapping("/{id}")
  public ApiLocaleResult<NotificationDetailVo> update(
      @Parameter(description = "通知ID") @PathVariable Long id,
      @Valid @RequestBody NotificationUpdateDto dto) {
    return ApiLocaleResult.success(notificationFacade.update(id, dto));
  }

  @Operation(operationId = "updateReadStatus", summary = "标记通知已读/未读",
      description = "标记单个或多个通知为已读/未读状态")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/read-status")
  public ApiLocaleResult<BatchOperationResultVo> updateReadStatus(
      @Valid @RequestBody NotificationReadStatusDto dto) {
    return ApiLocaleResult.success(notificationFacade.updateReadStatus(dto));
  }

  @Operation(operationId = "updateStarredStatus", summary = "标记通知星标状态",
      description = "标记单个或多个通知的星标状态")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/star-status")
  public ApiLocaleResult<BatchOperationResultVo> updateStarredStatus(
      @Valid @RequestBody NotificationStarStatusDto dto) {
    return ApiLocaleResult.success(notificationFacade.updateStarredStatus(dto));
  }

  @Operation(operationId = "archiveNotification", summary = "归档通知", description = "归档单个或多个通知")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "归档成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/archive")
  public ApiLocaleResult<BatchOperationResultVo> archive(
      @Valid @RequestBody NotificationArchiveDto dto) {
    return ApiLocaleResult.success(notificationFacade.archive(dto));
  }

  @Operation(operationId = "markAllAsRead", summary = "批量标记已读",
      description = "标记所有未读通知为已读")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "标记成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @PatchMapping("/mark-all-read")
  public ApiLocaleResult<BatchOperationResultVo> markAllAsRead() {
    return ApiLocaleResult.success(notificationFacade.markAllAsRead());
  }

  @Operation(operationId = "deleteNotification", summary = "删除通知", description = "删除单个或多个通知")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping
  public void delete(@Valid @RequestBody NotificationDeleteDto dto) {
    notificationFacade.delete(dto);
  }

  @Operation(operationId = "getNotificationDetail", summary = "查询通知详情",
      description = "根据ID查询通知详情")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "通知详情获取成功"),
      @ApiResponse(responseCode = "404", description = "通知不存在")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/{id}")
  public ApiLocaleResult<NotificationDetailVo> getDetail(
      @Parameter(description = "通知ID") @PathVariable Long id) {
    return ApiLocaleResult.success(notificationFacade.getDetail(id));
  }

  @Operation(operationId = "listNotifications", summary = "查询通知列表",
      description = "分页查询通知列表，支持多维度筛选和搜索")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "通知列表获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping
  public ApiLocaleResult<PageResult<NotificationDetailVo>> list(
      @Valid @ParameterObject NotificationQueryDto dto) {
    return ApiLocaleResult.success(notificationFacade.list(dto));
  }

  @Operation(operationId = "getNotificationStatistics", summary = "查询通知统计",
      description = "查询通知统计数据")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "统计数据获取成功")
  })
  @ResponseStatus(HttpStatus.OK)
  @GetMapping("/stats")
  public ApiLocaleResult<NotificationStatisticsVo> getStatistics() {
    return ApiLocaleResult.success(notificationFacade.getStatistics());
  }
}
