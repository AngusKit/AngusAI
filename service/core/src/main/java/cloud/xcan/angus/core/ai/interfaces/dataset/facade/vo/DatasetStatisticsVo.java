package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "数据集统计响应")
public class DatasetStatisticsVo {

  @Schema(description = "总数据集数")
  private long totalDatasets;

  @Schema(description = "活跃（被引用）数据集数")
  private long activeDatasets;

  @Schema(description = "总文件或表数")
  private long totalFilesOrTables;

  @Schema(description = "总记录数")
  private long totalRecords;

  @Schema(description = "记录总大小")
  private long totalRecordsSize;

  @Schema(description = "已使用存储空间大小")
  private String usedStoreSize;

  @Schema(description = "授权的存储空间大小，自定义数据源返回空")
  private String totalStoreSize;

  @Schema(description = "已使用存储空间占比，自定义数据源返回空")
  private String usedStoreRate;

}
