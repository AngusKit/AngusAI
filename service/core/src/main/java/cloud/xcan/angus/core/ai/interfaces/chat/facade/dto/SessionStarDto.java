package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "收藏会话请求")
public class SessionStarDto {

  @Schema(description = "是否收藏", required = true)
  @NotNull(message = "isStarred不能为空")
  private Boolean isStarred;
}
