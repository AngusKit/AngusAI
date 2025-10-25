package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

/**
 * 应用提示词DTO
 */
@Data
@Schema(description = "应用提示词请求")
public class PromptApplyDto {

  @Schema(description = "提示词ID", required = true)
  @NotNull(message = "提示词ID不能为空")
  private Long promptId;

  @Schema(description = "变量替换")
  private Map<String, Object> variables;
}
