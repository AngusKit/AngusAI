package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "测试数据源连接请求参数")
public class ConnectionTestDto {

  @NotBlank(message = "数据源类型不能为空")
  @Schema(description = "数据源类型", example = "database", required = true)
  private String sourceType;

  @Schema(description = "连接配置", required = true)
  private Object connection;
}
