package cloud.xcan.angus.core.ai.interfaces.chat;

import cloud.xcan.angus.core.ai.interfaces.chat.facade.MessageFacade;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFeedbackDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageFindDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.dto.MessageSendDto;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.AttachmentUploadVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.ChatStatisticsVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageSendVo;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.MessageVo;
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
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "ChatMessages", description = "对话消息管理 - 消息发送、接收、历史查询、反馈等功能")
@Validated
@RestController
@RequestMapping("/api/v1/chat/sessions")
public class MessageRest {

  @Resource
  private MessageFacade messageFacade;

  @Operation(operationId = "sendMessage", summary = "发送消息", description = "发送消息并获取AI响应")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "消息发送成功")
  })
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/{sessionId}/messages")
  public ApiLocaleResult<MessageSendVo> sendMessage(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Valid @RequestBody MessageSendDto dto) {
    return ApiLocaleResult.success(messageFacade.sendMessage(sessionId, dto));
  }

  @Operation(operationId = "sendMessageStream", summary = "发送消息（流式）", description = "发送消息并获取流式AI响应（Server-Sent Events）")
  @ApiResponses({
      @ApiResponse(responseCode = "200", description = "SSE流式响应")
  })
  @PostMapping(value = "/{sessionId}/messages/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter sendMessageStream(
      @PathVariable @Parameter(description = "会话ID") Long sessionId,
      @Valid @RequestBody MessageSendDto dto) {
    return messageFacade.sendMessageStream(sessionId, dto);
  }

  @Operation(operationId = "uploadAttachment", summary = "上传附件", description = "上传消息附件")
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/attachments")
  public ApiLocaleResult<AttachmentUploadVo> uploadAttachment(
      @Parameter(description = "文件") @RequestParam("file") MultipartFile file,
      @Parameter(description = "关联会话ID") @RequestParam(required = false) Long sessionId) {
    return ApiLocaleResult.success(messageFacade.uploadAttachment(file, sessionId));
  }

  @Operation(operationId = "regenerateMessage", summary = "重新生成", description = "重新生成AI响应")
  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping("/{sessionId}/messages/{messageId}/regenerate")
  public ApiLocaleResult<MessageVo> regenerate(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Parameter(description = "消息ID") @PathVariable Long messageId) {
    return ApiLocaleResult.success(messageFacade.regenerateMessage(sessionId, messageId));
  }

  @Operation(operationId = "feedbackMessage", summary = "消息反馈", description = "对AI消息进行反馈（点赞/点踩）")
  @PostMapping("/{sessionId}/messages/{messageId}/feedback")
  public ApiLocaleResult<MessageVo> feedback(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Parameter(description = "消息ID") @PathVariable Long messageId,
      @Valid @RequestBody MessageFeedbackDto dto) {
    return ApiLocaleResult.success(messageFacade.feedbackMessage(sessionId, messageId, dto));
  }

  @Operation(operationId = "stopGeneration", summary = "停止生成", description = "停止当前正在生成的消息")
  @PostMapping("/{sessionId}/stop")
  public ApiLocaleResult<MessageVo> stop(
      @Parameter(description = "会话ID") @PathVariable Long sessionId) {
    return ApiLocaleResult.success(messageFacade.stopGeneration(sessionId));
  }

  @Operation(operationId = "clearMessages", summary = "清空当前对话", description = "清空指定会话的所有消息")
  @DeleteMapping("/{sessionId}/messages")
  public ApiLocaleResult<Integer> clearMessages(
      @Parameter(description = "会话ID") @PathVariable Long sessionId) {
    return ApiLocaleResult.success(messageFacade.clearSessionMessages(sessionId));
  }

  @Operation(operationId = "deleteAttachment", summary = "删除附件", description = "删除附件")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @DeleteMapping("/attachments/{id}")
  public void deleteAttachment(@Parameter(description = "附件ID") @PathVariable Long id) {
    messageFacade.deleteAttachment(id);
  }

  @Operation(operationId = "getMessageHistory", summary = "获取消息历史", description = "获取会话的消息历史")
  @GetMapping("/{sessionId}/messages")
  public ApiLocaleResult<PageResult<MessageVo>> getMessages(
      @Parameter(description = "会话ID") @PathVariable Long sessionId,
      @Valid @ParameterObject MessageFindDto dto) {
    return ApiLocaleResult.success(messageFacade.listMessages(sessionId, dto));
  }

  @Operation(operationId = "voiceToText", summary = "语音输入", description = "语音转文字")
  @PostMapping("/voice-to-text")
  public ApiLocaleResult<String> voiceToText(
      @Parameter(description = "音频文件") @RequestParam("audio") MultipartFile audio,
      @Parameter(description = "语言代码") @RequestParam(required = false) String language) {
    // TODO: 实现语音识别逻辑
    // 1. 验证音频文件格式
    // 2. 调用语音识别服务（如 Whisper API）
    // 3. 返回识别结果
    // 模拟实现
    return ApiLocaleResult.successData("这是语音识别的模拟结果");
  }

  @Operation(operationId = "getChatStatistics", summary = "获取对话统计", description = "获取对话模块统计数据")
  @GetMapping("/stats")
  public ApiLocaleResult<ChatStatisticsVo> getStatistics(
      @Parameter(description = "统计周期") @RequestParam(required = false, defaultValue = "month") String period) {
    return ApiLocaleResult.success(messageFacade.getChatStatistics(period));
  }
}
