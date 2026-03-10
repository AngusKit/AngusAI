package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "切换模型请求")
public class SessionSwitchModelDto {

  @Schema(description = "新模型ID", required = true)
  @NotNull(message = "模型ID不能为空")
  private Long modelId;
}
