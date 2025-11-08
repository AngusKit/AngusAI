package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "数据集数据统计响应")
public class DatasetDataStatsVo {

  @Schema(description = "总文件或表数")
  private long totalFilesOrTables;

  @Schema(description = "总记录数")
  private long totalRecords;

  @Schema(description = "记录总大小")
  private String totalRecordsSize;

  @Schema(description = "已使用存储空间大小")
  private String usedStoreSize;

}
