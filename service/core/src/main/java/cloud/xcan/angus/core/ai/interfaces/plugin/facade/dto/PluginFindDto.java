package cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto;

import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "插件查询参数")
public class PluginFindDto extends PageQuery {

  @Schema(description = "分类筛选")
  private PluginCategory category;

  @Schema(description = "状态筛选")
  private PluginStatus status;

  @Schema(description = "类型筛选")
  private PluginType type;

  @Schema(description = "是否公开")
  private Boolean isPublic;

  @Schema(description = "是否系统插件")
  private Boolean isSystem;

  @Schema(description = "是否已验证")
  private Boolean isVerified;

  @Schema(description = "是否收藏")
  private Boolean isFavorite;

  @Schema(description = "标签筛选")
  private List<String> tags;

  @Schema(description = "最小评分")
  private Double minRating;

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "创建时间开始")
  private LocalDateTime createdDateStart;

  @Schema(description = "创建时间结束")
  private LocalDateTime createdDateEnd;

  @Schema(description = "最后修改人ID")
  protected Long lastModifiedBy;

  @Schema(description = "最后修改时间")
  private LocalDateTime lastModifiedDate;

  @Override
  public String getDefaultOrderBy() {
    return "lastModifiedDate";
  }
}
