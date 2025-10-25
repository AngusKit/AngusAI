package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "数据集统计响应")
public class DatasetStatisticsVo {

  @Schema(description = "总数据集数")
  private Object totalDatasets;

  @Schema(description = "总记录数")
  private Object totalRecords;

  @Schema(description = "活跃数据集数")
  private Object activeDatasets;

  @Schema(description = "存储使用情况")
  private Object storageUsage;

  @Schema(description = "批量删除结果")
  private Object batchDeleteResult;
}
