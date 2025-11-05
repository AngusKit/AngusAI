package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "连接测试请求参数")
public class ConnectionTestDto {

  @Schema(description = "超时时间（秒）", example = "30")
  @Min(1)
  private Integer timeout = 30;
}

