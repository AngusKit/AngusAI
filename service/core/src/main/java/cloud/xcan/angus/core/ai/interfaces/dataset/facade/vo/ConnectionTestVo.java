package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "连接测试响应")
public class ConnectionTestVo {

  @Schema(description = "状态")
  private String status;

  @Schema(description = "消息")
  private String message;

  @Schema(description = "详细信息")
  private Object details;
}
