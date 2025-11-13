package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "接口端点详情")
public class ApiEndpointVo extends TenantAuditingVo {

  @Schema(description = "端点ID")
  private Long id;

  @Schema(description = "接口集ID")
  private Long collectionId;

  @Schema(description = "端点名称")
  private String name;

  @Schema(description = "HTTP方法")
  private HttpMethod method;

  @Schema(description = "路径")
  private String path;

  @Schema(description = "操作标识符，用于OpenAPI规范解析的唯一标识")
  private String operationId;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "过期标志")
  private Boolean deprecated;

  @Schema(description = "标签")
  private List<String> tags;
}

