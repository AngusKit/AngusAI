package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 切换应用DTO
 */
@Data
@Schema(description = "切换应用请求")
public class SessionSwitchAppDto {

  @Schema(description = "新应用ID", required = true)
  @NotNull(message = "应用ID不能为空")
  private Long appId;
}
