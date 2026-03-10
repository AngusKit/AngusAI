package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建会话请求")
public class SessionCreateDto {

  @Length(max = 200)
  @Schema(description = "会话标题", example = "新对话")
  private String title;

  @NotNull
  @Schema(description = "关联的应用ID", requiredMode = RequiredMode.REQUIRED)
  private Long appId;

  @Schema(description = "使用的模型ID")
  private Long modelId;

  @Schema(description = "会话配置")
  private SessionConfig config;

}
