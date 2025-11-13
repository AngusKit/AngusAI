package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "接口集列表项")
public class ApiCollectionListVo extends TenantAuditingVo {

  @Schema(description = "接口集ID")
  private Long id;

  @Schema(description = "名称")
  private String name;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "来源")
  private ApiCollectionSource source;

  @Schema(description = "来源图标")
  private String sourceIcon;

  @Schema(description = "端点总数")
  private Long endpointsCount;

  @Schema(description = "已启用的接口数")
  private Long enabledEndpointsCount;

  @Schema(description = "可见性")
  private Visibility visibility;

}

