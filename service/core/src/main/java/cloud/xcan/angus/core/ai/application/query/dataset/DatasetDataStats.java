package cloud.xcan.angus.core.ai.application.query.dataset;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 数据集数据统计
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatasetDataStats {

  private Long datasetId;
  private long totalFilesOrTables;
  private long totalRecords;
  private long totalRecordsSize;
}
