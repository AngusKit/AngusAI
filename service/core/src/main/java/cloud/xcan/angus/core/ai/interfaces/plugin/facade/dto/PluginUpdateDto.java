package cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto;

import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginConfig;
import cloud.xcan.angus.core.ai.domain.plugin.PluginPermissions;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.domain.plugin.PluginTag;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新插件请求参数")
public class PluginUpdateDto {

  @Length(max = 100)
  @Schema(description = "插件名称")
  private String name;

  @Length(max = 100)
  @Schema(description = "插件英文名称")
  private String nameEn;

  @Schema(description = "插件图标")
  private String icon;

  @Length(max = 500)
  @Schema(description = "插件描述")
  private String description;

  @Length(max = 100)
  @Schema(description = "作者")
  private String author;

  @Length(max = 20)
  @Schema(description = "版本号")
  private String version;

  @Schema(description = "插件分类")
  private PluginCategory category;

  @Schema(description = "插件状态")
  private PluginStatus status;

  @Schema(description = "插件类型")
  private PluginType type;

  @Schema(description = "插件配置")
  private PluginConfig config;

  @Schema(description = "权限配置")
  private PluginPermissions permissions;

  @Schema(description = "标签列表")
  private List<PluginTag> tags;

  @Schema(description = "是否公开")
  private Boolean isPublic;

  @Length(max = 20)
  @Schema(description = "最小系统版本要求")
  private String minVersion;

  @Length(max = 500)
  @Schema(description = "主页URL")
  private String homepageUrl;

  @Length(max = 500)
  @Schema(description = "文档URL")
  private String documentationUrl;

  @Length(max = 500)
  @Schema(description = "源码仓库URL")
  private String repositoryUrl;

  @Length(max = 500)
  @Schema(description = "支持URL")
  private String supportUrl;

  @Length(max = 50)
  @Schema(description = "许可证")
  private String license;

  @Schema(description = "价格")
  private Double price;

  @Length(max = 10)
  @Schema(description = "货币单位")
  private String currency;
}
