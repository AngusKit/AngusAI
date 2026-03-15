package cloud.xcan.angus.core.ai.interfaces.agent.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.domain.chat.openai.OpenAIChatCompletionsRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.util.List;

/**
 * 智能体对话请求（严格遵循 OpenAI 消息格式）
 * <p>
 * 消息格式：messages 数组，每项为 {role: system|user|assistant, content: string}
 * 对话流程：每次请求携带完整消息历史（与 OpenAI Chat Completions 一致）
 * <p>
 * 会话管理（二选一）：
 * <ul>
 *   <li>sessionId：已有会话，用于持久化与记忆</li>
 *   <li>appId：新建会话，自动创建并返回 sessionId</li>
 * </ul>
 */
@Data
@Schema(description = "智能体对话请求（OpenAI 消息格式）")
public class AgentChatRequestDto {

  @Schema(description = "应用ID；新建会话时必填，与 sessionId 二选一", example = "1")
  private Long appId;

  @Schema(description = "使用的模型ID；新建会话时可选")
  private Long modelId;

  @Schema(description = "使用的智能体ID；新建会话时可选，不传则使用应用默认智能体")
  private Long agentId;

  @Schema(description = "会话ID(UUID)；已有会话时必填，与 appId 二选一", example = "550e8400-e29b-41d4-a716-446655440000")
  @Length(max = 36)
  private String sessionId;

  @NotNull
  @NotEmpty
  @Valid
  @Schema(description = "消息列表（OpenAI 格式），必须包含至少一条 user 消息", requiredMode = Schema.RequiredMode.REQUIRED)
  private List<OpenAIChatCompletionsRequest.ChatMessage> messages;

  @Valid
  @Schema(description = "对话配置覆盖，可选")
  private SessionConfig config;

}
