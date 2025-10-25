package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 创建会话DTO
 */
@Data
@Schema(description = "创建会话请求")
public class SessionCreateDto {

  @Schema(description = "会话标题", example = "新对话")
  @Size(max = 200, message = "标题长度不能超过200字符")
  private String title = "新对话";

  @Schema(description = "关联的应用ID", required = true)
  @NotNull(message = "应用ID不能为空")
  private Long appId;

  @Schema(description = "使用的模型ID", required = true)
  @NotNull(message = "模型ID不能为空")
  private Long modelId;

  @Schema(description = "会话配置")
  private SessionConfig config;
}
