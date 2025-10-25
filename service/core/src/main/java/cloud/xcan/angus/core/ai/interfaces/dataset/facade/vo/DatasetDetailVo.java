package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
import cloud.xcan.angus.core.ai.domain.dataset.Visibility;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "数据集详情响应")
public class DatasetDetailVo {

  @Schema(description = "数据集ID")
  private Long id;

  @Schema(description = "数据集名称")
  private String name;

  @Schema(description = "数据集描述")
  private String description;

  @Schema(description = "图标emoji")
  private String icon;

  @Schema(description = "背景色")
  private String iconBg;

  @Schema(description = "数据类型")
  private DatasetType type;

  @Schema(description = "数据量")
  private String dataCount;

  @Schema(description = "大小")
  private String size;

  @Schema(description = "状态")
  private String status;

  @Schema(description = "状态颜色")
  private String statusColor;

  @Schema(description = "可见性")
  private Visibility visibility;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改时间")
  private LocalDateTime lastModifiedDate;

  @Schema(description = "创建者姓名")
  private String createdByName;

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "标签")
  private List<String> tags;

  @Schema(description = "配置信息")
  private Object config;

  @Schema(description = "统计信息")
  private Object stats;
}
