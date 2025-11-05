package cloud.xcan.angus.core.ai.interfaces.vector.facade.vo;

import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "连接测试结果")
public class ConnectionTestVo {

  @Schema(description = "是否成功")
  private Boolean success;

  @Schema(description = "状态")
  private ConnectionStatus status;

  @Schema(description = "测试连接返回信息")
  private String message;

  @Schema(description = "测试详情")
  private TestDetails testDetails;

  @Data
  @Schema(description = "测试详情")
  public static class TestDetails {
    @Schema(description = "索引数量")
    private Long indexCount;

    @Schema(description = "向量维度")
    private Integer dimension;

    @Schema(description = "响应时间（毫秒）")
    private Long responseTime;

    @Schema(description = "数据库版本")
    private String version;
  }

}

