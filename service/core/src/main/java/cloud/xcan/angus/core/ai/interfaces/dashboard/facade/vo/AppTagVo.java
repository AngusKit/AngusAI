package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "标签项")
public class AppTagVo {

  @Schema(description = "标签文本")
  private String label;

  @Schema(description = "样式类名（如 bg-blue-100 text-blue-700）")
  private String color;
}
