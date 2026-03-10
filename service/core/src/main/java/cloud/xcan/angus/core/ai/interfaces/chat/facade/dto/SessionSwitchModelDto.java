package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "切换模型请求")
public class SessionSwitchModelDto {

  @NotNull
  @Schema(description = "新模型ID", requiredMode = RequiredMode.REQUIRED)
  private Long modelId;
}
