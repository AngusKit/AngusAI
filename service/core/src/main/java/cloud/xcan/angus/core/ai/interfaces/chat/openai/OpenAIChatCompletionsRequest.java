package cloud.xcan.angus.core.ai.interfaces.chat.openai;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;

/**
 * OpenAI Chat Completions 请求体（兼容 OpenAI API 标准）
 *
 * @see <a href="https://platform.openai.com/docs/api-reference/chat/create">OpenAI API
 * Reference</a>
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "OpenAI Chat Completions 请求（兼容 OpenAI API 标准）")
public class OpenAIChatCompletionsRequest {

  @NotNull
  @NotEmpty
  @Valid
  @Schema(description = "消息列表", requiredMode = Schema.RequiredMode.REQUIRED)
  private List<ChatMessage> messages;

  @Schema(description = "模型标识：agent_123 或 123 表示智能体；应用入口下可选，不传则用默认 Agent")
  private String model;

  @Schema(description = "是否流式返回", example = "false")
  private Boolean stream = false;

  @Schema(description = "温度参数 0-2", example = "0.7")
  private Double temperature;

  @JsonProperty("max_tokens")
  @Schema(description = "最大生成 token 数")
  private Integer maxTokens;

  @Schema(description = "生成数量 n>1 时返回多个 choices")
  private Integer n = 1;

  @Schema(description = "停止序列")
  private List<String> stop;

  @JsonProperty("presence_penalty")
  @Schema(description = "存在惩罚 -2.0 到 2.0")
  private Double presencePenalty;

  @JsonProperty("frequency_penalty")
  @Schema(description = "频率惩罚 -2.0 到 2.0")
  private Double frequencyPenalty;

  @Schema(description = "随机种子")
  private Integer seed;

  @Data
  @Schema(description = "Chat 消息")
  public static class ChatMessage {

    @Schema(description = "角色：system/user/assistant", requiredMode = Schema.RequiredMode.REQUIRED, allowableValues = {
        "system", "user", "assistant"})
    private String role;

    @Schema(description = "消息内容", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;

    @Schema(description = "消息发送者名称（可选）")
    private String name;
  }
}
