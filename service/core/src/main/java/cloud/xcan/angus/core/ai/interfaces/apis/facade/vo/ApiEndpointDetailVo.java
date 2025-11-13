package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.models.PathItem.HttpMethod;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "接口端点详情")
public class ApiEndpointDetailVo extends TenantAuditingVo {

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

  @Schema(description = "描述")
  private String description;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "过期标志")
  private Boolean deprecated;

  @Schema(description = "标签")
  private List<String> tags;

  @Schema(description = "操作标识符，用于OpenAPI规范解析的唯一标识")
  private String operationId;

  @Schema(description = "请求参数列表，遵循OpenAPI Parameter Object规范")
  private List<Parameter> parameters;

  @Schema(description = "请求体配置，遵循OpenAPI Request Body Object规范")
  private RequestBody requestBody;

  @Schema(description = "响应配置映射，键为HTTP状态码，值为响应对象，遵循OpenAPI Response Object规范")
  private Map<String, ApiResponse> responses;
}

