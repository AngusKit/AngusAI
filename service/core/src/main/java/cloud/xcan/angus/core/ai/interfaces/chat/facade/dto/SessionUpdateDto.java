package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 更新会话DTO
 */
@Data
@Schema(description = "更新会话请求")
public class SessionUpdateDto {

  @Schema(description = "会话标题")
  @Size(max = 200, message = "标题长度不能超过200字符")
  private String title;

  @Schema(description = "会话配置")
  private SessionConfig config;

}
