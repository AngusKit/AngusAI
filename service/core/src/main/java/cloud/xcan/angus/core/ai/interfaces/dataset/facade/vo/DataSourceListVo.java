package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "数据源列表项响应")
public class DataSourceListVo {

  @Schema(description = "数据源ID")
  private Long id;

  @Schema(description = "数据源名称")
  private String name;

  @Schema(description = "数据源类型")
  private String sourceType;

  @Schema(description = "数据源类型标签")
  private String sourceTypeLabel;

  @Schema(description = "类型图标")
  private String typeIcon;

  @Schema(description = "类型颜色")
  private String typeColor;

  @Schema(description = "大小")
  private String size;

  @Schema(description = "状态")
  private String status;

  @Schema(description = "状态颜色")
  private String statusColor;

  @Schema(description = "添加时间")
  private String addedTime;

  @Schema(description = "记录数")
  private String recordCount;

  @Schema(description = "最后同步时间")
  private String lastSync;

  @Schema(description = "连接信息")
  private Object connection;
}
