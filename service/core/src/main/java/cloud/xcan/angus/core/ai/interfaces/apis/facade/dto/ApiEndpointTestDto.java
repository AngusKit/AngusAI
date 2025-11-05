package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.spec.http.HttpMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.servers.Server;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "测试接口端点请求参数")
public class ApiEndpointTestDto {

  @NotNull
  @Schema(description = "HTTP方法：GET、POST、PUT、DELETE、PATCH等", example = "GET", requiredMode = RequiredMode.REQUIRED)
  private HttpMethod method;

  @NotNull
  @Schema(description = "服务器配置，包含API连接和部署信息，遵循OpenAPI Server Object规范")
  private Server server;

  @Length(max = 800)
  @Schema(description = "接口路径，不包含查询参数，用于资源标识", example = "/comm/api/v1/country/{id}")
  private String endpoint;

  @Schema(description = "请求超时时间（毫秒），范围：1-300000", example = "30000")
  @Min(1)
  @Max(300000)
  private Integer timeout = 30000;

  @Size(max = 50)
  @Schema(description = "请求参数列表，遵循OpenAPI Parameter Object规范")
  private List<Parameter> parameters;

  @Schema(description = "请求体配置，遵循OpenAPI Request Body Object规范")
  private RequestBody requestBody;

}

