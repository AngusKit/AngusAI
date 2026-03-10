package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "收藏会话请求")
public class SessionStarDto {

  @NotNull
  @Schema(description = "是否收藏", requiredMode = RequiredMode.REQUIRED)
  private Boolean isStarred;
}
