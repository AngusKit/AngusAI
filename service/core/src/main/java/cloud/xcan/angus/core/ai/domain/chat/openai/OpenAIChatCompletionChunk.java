package cloud.xcan.angus.core.ai.domain.chat.openai;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OpenAI Chat Completions 流式 Chunk（兼容 OpenAI SSE 格式）
 *
 * @see <a href="https://platform.openai.com/docs/api-reference/chat/streaming">OpenAI Streaming
 * API</a>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "OpenAI Chat Completions 流式 Chunk（SSE 每 token 推送的数据结构）")
public class OpenAIChatCompletionChunk {

  @Schema(description = "唯一标识，流式场景常用固定值 chatcmpl-stream", example = "chatcmpl-stream")
  private String id;

  @JsonProperty("session_id")
  @Schema(description = "会话 ID，无会话模式时首块携带，供前端建立关联；有会话模式时通常不传")
  private String sessionId;

  @Schema(description = "对象类型，流式固定为 chat.completion.chunk", example = "chat.completion.chunk")
  private String object;

  @Schema(description = "创建时间（Unix 秒）")
  private Long created;

  @Schema(description = "使用的模型名称", example = "agent_123")
  private String model;

  @Schema(description = "生成选项列表，流式时每块通常仅一个元素")
  private List<ChunkChoice> choices;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Schema(description = "流式 Chunk 中的生成选项")
  public static class ChunkChoice {

    @Schema(description = "生成选项索引，通常为 0")
    private Integer index;

    @Schema(description = "增量消息，包含当前 token 对应的增量内容")
    private OpenAIChatCompletionsResponse.Delta delta;

    @JsonProperty("finish_reason")
    @Schema(
        description = "结束原因：流进行中为 null；流结束时取值：stop（正常结束）、length（达到 max_tokens）、tool_calls（需调用工具）、content_filter（内容过滤）等",
        allowableValues = {"stop", "length", "tool_calls", "content_filter"},
        nullable = true,
        example = "null"
    )
    private String finishReason;
  }
}
