package cloud.xcan.angus.core.ai.interfaces.model.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "模型性能监控响应")
public class ModelMetricsVo {

  @Schema(description = "统计周期")
  private Object period;

  @Schema(description = "延迟时序数据")
  private Object latency;

  @Schema(description = "吞吐量时序数据")
  private Object throughput;

  @Schema(description = "成功率时序数据")
  private Object successRate;

  @Schema(description = "CPU使用时序数据")
  private Object cpu;

  @Schema(description = "内存使用时序数据")
  private Object memory;

  @Schema(description = "GPU使用时序数据")
  private Object gpu;

  @Schema(description = "成本时序数据")
  private Object cost;
}
