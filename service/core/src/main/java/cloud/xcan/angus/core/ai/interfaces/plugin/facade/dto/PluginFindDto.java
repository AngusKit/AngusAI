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

  @Schema(description = "插件ID")
  private Long id;

  @Schema(description = "插件名称")
  private String name;

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

  @Schema(description = "安装次数")
  private Long installCount;

  @Schema(description = "使用次数")
  private Long usageCount;

  @Schema(description = "评价数量")
  private Long reviewCount;

  @Schema(description = "评分")
  private Double rating;

  @Schema(description = "最小评分")
  private Double minRating;

  @Schema(description = "所属租户ID", example = "1")
  private Long tenantId;

  @Schema(description = "创建人ID", example = "1")
  private Long createdBy;

  @Schema(description = "创建时间", example = "2024-10-12 00:00:00")
  private LocalDateTime createdDate;

  @Schema(description = "排序字段", allowableValues = {"id", "createdDate", "name", "category",
      "status", "type", "installCount", "usageCount", "reviewCount", "rating", "minRating"})
  private String orderBy = "createdDate";

  @Override
  public String getDefaultOrderBy() {
    return "createdDate";
  }
}
