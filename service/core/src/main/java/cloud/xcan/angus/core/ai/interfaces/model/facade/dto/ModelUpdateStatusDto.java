package cloud.xcan.angus.core.ai.interfaces.model.facade.dto;

import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "修改模型状态请求参数")
public class ModelUpdateStatusDto {

  @NotNull(message = "状态不能为空")
  @Schema(description = "模型状态：ACTIVE-激活，DISABLED-禁用", requiredMode = Schema.RequiredMode.REQUIRED)
  private ModelStatus status;
}
