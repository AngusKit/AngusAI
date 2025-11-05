package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "接口集详情")
public class ApiCollectionVo {

  @Schema(description = "接口集ID")
  private Long id;

  @Schema(description = "名称")
  private String name;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "来源")
  private ApiCollectionSource source;

  @Schema(description = "来源标签")
  private String sourceLabel;

  @Schema(description = "来源图标")
  private String sourceIcon;

  @Schema(description = "可见性")
  private Visibility visibility;

  @Schema(description = "可见性标签")
  private String visibilityLabel;

  @Schema(description = "端点总数")
  private Long endpointsCount;

  @Schema(description = "已启用的接口数")
  private Long enabledCount;

  @Schema(description = "服务器配置")
  private Map<String, Object> serverConfig;

  @Schema(description = "安全配置")
  private Map<String, Object> securityConfig;

  @Schema(description = "是否配置了服务器")
  private Boolean hasServerConfig;

  @Schema(description = "是否配置了安全认证")
  private Boolean hasSecurityConfig;

  @Schema(description = "创建时间戳")
  private Long createdAt;

  @Schema(description = "创建日期")
  private String createdDate;

  @Schema(description = "更新时间戳")
  private Long updatedAt;

  @Schema(description = "更新日期")
  private String updatedDate;

  @Schema(description = "最后使用时间戳")
  private Long lastUsedAt;

  @Schema(description = "拥有者ID")
  private Long ownerId;

  @Schema(description = "拥有者名称")
  private String ownerName;

  @Schema(description = "接口端点列表")
  private List<ApiEndpointVo> endpoints;

  @Schema(description = "标签统计")
  private List<TagStat> tags;

  @Schema(description = "分类统计")
  private List<CategoryStat> categories;

  @Data
  @Schema(description = "标签统计")
  public static class TagStat {
    @Schema(description = "标签名称")
    private String name;

    @Schema(description = "数量")
    private Long count;
  }

  @Data
  @Schema(description = "分类统计")
  public static class CategoryStat {
    @Schema(description = "分类名称")
    private String name;

    @Schema(description = "数量")
    private Long count;
  }
}

