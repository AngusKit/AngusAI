package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "切换应用请求")
public class SessionSwitchAppDto {

  @NotNull
  @Schema(description = "新应用ID", requiredMode = RequiredMode.REQUIRED)
  private Long appId;
}
