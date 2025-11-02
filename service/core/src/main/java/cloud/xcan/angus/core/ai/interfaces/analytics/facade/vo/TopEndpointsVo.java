package cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "Top接口统计")
public class TopEndpointsVo {

  @Schema(description = "接口列表")
  private List<EndpointItemVo> items;

  @Data
  @Schema(description = "接口项")
  public static class EndpointItemVo {

    @Schema(description = "接口路径", example = "/v1/chat/completions")
    private String endpoint;

    @Schema(description = "HTTP方法", example = "POST")
    private String method;

    @Schema(description = "调用次数")
    private Long calls;

    @Schema(description = "平均响应时间(显示)", example = "1.2s")
    private String avgTime;

    @Schema(description = "平均响应时间(毫秒)")
    private Integer avgTimeMs;

    @Schema(description = "成功率(显示)", example = "98.5%")
    private String successRate;

    @Schema(description = "成功率(数值)")
    private Double successRateValue;

    @Schema(description = "总Token数")
    private Long totalTokens;

    @Schema(description = "错误次数")
    private Long errors;
  }

}
