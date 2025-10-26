package cloud.xcan.angus.core.ai.interfaces.chat;

import cloud.xcan.angus.core.ai.interfaces.chat.facade.SessionFacade;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.*;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionDetailVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionListVo;
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
import org.springframework.web.bind.annotation.*;

/**
 * 对话会话REST接口
 */
@Tag(name = "Chat Session", description = "对话会话管理 - 会话创建、更新、删除、切换等功能")
@Validated
@RestController
@RequestMapping("/api/v1/chat/sessions")
public class SessionRest {

  @Resource
  private SessionFacade sessionFacade;

  @Operation(operationId = "createSession", summary = "创建会话", description = "创建新的对话会话")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "会话创建成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping
  public ApiLocaleResult<SessionDetailVo> create(@Valid @RequestBody SessionCreateDto dto) {
    return ApiLocaleResult.success(sessionFacade.createSession(dto));
  }

  @Operation(operationId = "updateSession", summary = "更新会话", description = "更新会话基本信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "更新成功")
  })
  @PatchMapping("/{id}")
  public ApiLocaleResult<SessionDetailVo> update(
      @Parameter(description = "会话ID") @PathVariable Long id,
      @Valid @RequestBody SessionUpdateDto dto) {
    return ApiLocaleResult.success(sessionFacade.updateSession(id, dto));
  }

  @Operation(operationId = "switchApp", summary = "切换应用", description = "切换会话使用的应用")
  @PatchMapping("/{sessionId}/switch-app")
  public ApiLocaleResult<SessionDetailVo> switchApp(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Valid @RequestBody SessionSwitchAppDto dto) {
    return ApiLocaleResult.success(sessionFacade.switchApp(sessionId, dto));
  }

  @Operation(operationId = "switchModel", summary = "切换模型", description = "切换会话使用的AI模型")
  @PatchMapping("/{sessionId}/switch-model")
  public ApiLocaleResult<SessionDetailVo> switchModel(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Valid @RequestBody SessionSwitchModelDto dto) {
    return ApiLocaleResult.success(sessionFacade.switchModel(sessionId, dto));
  }

  @Operation(operationId = "starSession", summary = "收藏/取消收藏会话", description = "收藏或取消收藏会话（前端显示为星标）")
  @PatchMapping("/{sessionId}/star")
  public ApiLocaleResult<SessionDetailVo> star(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Valid @RequestBody SessionStarDto dto) {
    return ApiLocaleResult.success(sessionFacade.starSession(sessionId, dto));
  }

  @Operation(operationId = "applyPrompt", summary = "应用提示词", description = "将提示词库中的提示词应用到当前会话")
  @PostMapping("/{sessionId}/apply-prompt")
  @SuppressWarnings("unchecked")
  public ApiLocaleResult<String> applyPrompt(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Valid @RequestBody PromptApplyDto dto) {
    return (ApiLocaleResult<String>) ApiLocaleResult.success(sessionFacade.applyPrompt(sessionId, dto));
  }

  @Operation(operationId = "deleteSession", summary = "删除会话", description = "删除指定会话")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "204", description = "删除成功")
  })
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/{id}")
  public void delete(@Parameter(description = "会话ID") @PathVariable Long id) {
    sessionFacade.deleteSession(id);
  }

  @Operation(operationId = "batchDeleteSessions", summary = "批量删除会话", description = "批量删除会话")
  @PostMapping("/batch-delete")
  public ApiLocaleResult<Integer> batchDelete(@Valid @RequestBody SessionBatchDeleteDto dto) {
    return ApiLocaleResult.success(sessionFacade.batchDeleteSessions(dto));
  }

  @Operation(operationId = "getSessionDetail", summary = "获取会话详情", description = "获取指定会话的详细信息")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "会话详情获取成功"),
      @ApiResponse(responseCode = "404", description = "会话不存在")
  })
  @GetMapping("/{id}")
  public ApiLocaleResult<SessionDetailVo> getDetail(@Parameter(description = "会话ID") @PathVariable Long id) {
    return ApiLocaleResult.success(sessionFacade.getSessionDetail(id));
  }

  @Operation(operationId = "getSessionList", summary = "获取会话列表", description = "获取用户的对话会话列表，支持分页、搜索和筛选")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "会话列表获取成功")
  })
  @GetMapping
  public ApiLocaleResult<PageResult<SessionListVo>> list(@Valid @ParameterObject SessionFindDto dto) {
    return ApiLocaleResult.success(sessionFacade.listSessions(dto));
  }

  @Operation(operationId = "exportSession", summary = "导出会话", description = "导出会话内容")
  @GetMapping("/{sessionId}/export")
  public void export(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Parameter(description = "导出格式") @RequestParam(required = false, defaultValue = "json") String format) {
    // TODO: 实现导出逻辑
  }
}
