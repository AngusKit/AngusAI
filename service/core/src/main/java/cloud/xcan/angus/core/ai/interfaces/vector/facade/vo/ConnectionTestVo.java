package cloud.xcan.angus.core.ai.interfaces.vector.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "连接测试结果")
public class ConnectionTestVo {

  @Schema(description = "是否成功")
  private Boolean success;

  @Schema(description = "状态")
  private String status;

  @Schema(description = "测试详情")
  private TestDetails testDetails;

  @Schema(description = "错误信息")
  private ErrorInfo error;

  @Data
  @Schema(description = "测试详情")
  public static class TestDetails {
    @Schema(description = "响应时间（毫秒）")
    private Long responseTime;

    @Schema(description = "索引数量")
    private Long indexCount;

    @Schema(description = "向量维度")
    private Integer dimension;

    @Schema(description = "数据库版本")
    private String version;
  }

  @Data
  @Schema(description = "错误信息")
  public static class ErrorInfo {
    @Schema(description = "错误码")
    private String code;

    @Schema(description = "错误消息")
    private String message;

    @Schema(description = "错误详情")
    private String details;
  }
}

