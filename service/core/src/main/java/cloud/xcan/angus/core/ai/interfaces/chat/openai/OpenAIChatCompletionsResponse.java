package cloud.xcan.angus.core.ai.interfaces.chat.openai;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * OpenAI Chat Completions 响应体（兼容 OpenAI API 标准）
 *
 * @see <a href="https://platform.openai.com/docs/api-reference/chat/object">OpenAI API
 * Reference</a>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "OpenAI Chat Completions 响应（兼容 OpenAI API 标准）")
public class OpenAIChatCompletionsResponse {

  @Schema(description = "唯一标识")
  private String id;

  @Schema(description = "对象类型", example = "chat.completion")
  private String object = "chat.completion";

  @Schema(description = "创建时间 Unix 秒")
  private Long created;

  @Schema(description = "使用的模型")
  private String model;

  @Schema(description = "生成选项列表")
  private List<Choice> choices;

  @Schema(description = "Token 使用统计")
  private Usage usage;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Schema(description = "生成选项")
  public static class Choice {

    @Schema(description = "索引")
    private Integer index;

    @Schema(description = "助手消息")
    private Message message;

    @Schema(description = "流式时的增量消息")
    private Delta delta;

    @JsonProperty("finish_reason")
    @Schema(description = "结束原因：stop/length/tool_calls/content_filter")
    private String finishReason;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Schema(description = "消息")
  public static class Message {

    @Schema(description = "角色", example = "assistant")
    private String role = "assistant";

    @Schema(description = "内容")
    private String content;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Schema(description = "流式增量消息")
  public static class Delta {

    @Schema(description = "角色")
    private String role;

    @Schema(description = "增量内容")
    private String content;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Schema(description = "Token 使用统计")
  public static class Usage {

    @JsonProperty("prompt_tokens")
    @Schema(description = "输入 token 数")
    private Integer promptTokens;

    @JsonProperty("completion_tokens")
    @Schema(description = "输出 token 数")
    private Integer completionTokens;

    @JsonProperty("total_tokens")
    @Schema(description = "总 token 数")
    private Integer totalTokens;
  }
}
