package cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo;

import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "插件列表项")
public class PluginListVo extends TenantAuditingVo {

  @Schema(description = "插件ID")
  private Long id;

  @Schema(description = "插件名称")
  private String name;

  @Schema(description = "插件图标")
  private String icon;

  @Schema(description = "插件描述")
  private String description;

  @Schema(description = "作者")
  private String author;

  @Schema(description = "版本号")
  private String version;

  @Schema(description = "插件分类")
  private PluginCategory category;

  @Schema(description = "插件状态")
  private PluginStatus status;

  @Schema(description = "插件类型")
  private PluginType type;

  @Schema(description = "标签列表")
  private List<String> tags;

  @Schema(description = "安装次数")
  private Long installCount;

  @Schema(description = "使用次数")
  private Long usageCount;

  @Schema(description = "评分")
  private Double rating;

  @Schema(description = "评价数量")
  private Long reviewCount;

  @Schema(description = "是否收藏")
  private Boolean isFavorite;

  @Schema(description = "是否系统插件")
  private Boolean isSystem;

  @Schema(description = "是否公开")
  private Boolean isPublic;

  @Schema(description = "是否已验证")
  private Boolean isVerified;

  @Schema(description = "价格")
  private Double price;

  @Schema(description = "货币单位")
  private String currency;

  @Schema(description = "发布时间")
  private LocalDateTime publishedDate;
}
