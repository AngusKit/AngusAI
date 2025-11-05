package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "接口端点测试结果")
public class ApiEndpointTestVo {

  @Schema(description = "是否成功")
  private Boolean success;

  @Schema(description = "状态码")
  private Integer statusCode;

  @Schema(description = "响应时间（毫秒）")
  private Long responseTime;

  @Schema(description = "响应头")
  private Map<String, String> responseHeaders;

  @Schema(description = "响应体")
  private Object responseBody;

  @Schema(description = "错误信息")
  private String error;
}

