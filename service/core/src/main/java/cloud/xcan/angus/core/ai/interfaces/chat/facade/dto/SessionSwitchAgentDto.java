package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "切换智能体请求")
public class SessionSwitchAgentDto {

  @NotNull
  @Schema(description = "新智能体ID", requiredMode = RequiredMode.REQUIRED)
  private Long agentId;
}
