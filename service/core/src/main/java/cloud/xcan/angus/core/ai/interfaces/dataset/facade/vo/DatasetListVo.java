package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetStatus;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetVisibility;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "数据集列表项响应")
public class DatasetListVo extends TenantAuditingVo {

  @Schema(description = "数据集ID")
  private Long id;

  @Schema(description = "数据集名称")
  private String name;

  @Schema(description = "数据集描述")
  private String description;

  @Schema(description = "数据集类型")
  private DatasetType type;

  @Schema(description = "数据集状态")
  private DatasetStatus status;

  @Schema(description = "可见性")
  private DatasetVisibility visibility;

  @Schema(description = "图标emoji")
  private String icon;

  @Schema(description = "背景色")
  private String iconBg;

  @Schema(description = "标签")
  private List<String> tags;

  @Schema(description = "数据源配置信息")
  private DatasourceConfigVo datasourceConfig;

  @Schema(description = "统计信息")
  private DatasetDataStatisticsVo dataStatistics;

}
