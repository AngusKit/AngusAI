package cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "折线图数据点")
public class ChartDataPointVo {

  @Schema(description = "数据点ID")
  private String id;

  @Schema(description = "日期/时间标签")
  private String date;

  @Schema(description = "数值")
  private long value;
}
