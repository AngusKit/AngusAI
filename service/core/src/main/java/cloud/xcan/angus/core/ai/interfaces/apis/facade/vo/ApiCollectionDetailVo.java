package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "接口集详情")
public class ApiCollectionDetailVo extends TenantAuditingVo {

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

  @Schema(description = "可见性")
  private Visibility visibility;

  @Schema(description = "是否配置了服务器")
  private Boolean hasServerConfig;

  @Schema(description = "服务器配置")
  private List<Server> servers;

  @Schema(description = "是否配置了安全认证")
  private Boolean hasSecurityConfig;

  @Schema(description = "安全认证配置")
  private List<SecurityScheme> securities;

  @Schema(description = "端点总数")
  private Long endpointsCount;

  @Schema(description = "已启用的接口数")
  private Long enabledEndpointsCount;
}

