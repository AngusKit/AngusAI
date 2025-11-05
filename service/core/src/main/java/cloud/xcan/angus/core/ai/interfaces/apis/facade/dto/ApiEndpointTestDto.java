package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "测试接口端点请求参数")
public class ApiEndpointTestDto {

  @Schema(description = "请求头")
  private Map<String, String> headers;

  @Schema(description = "查询参数")
  private Map<String, Object> queryParams;

  @Schema(description = "请求体")
  private Object body;

  @Schema(description = "超时时间（毫秒）", example = "30000")
  @Min(1)
  private Integer timeout = 30000;
}

