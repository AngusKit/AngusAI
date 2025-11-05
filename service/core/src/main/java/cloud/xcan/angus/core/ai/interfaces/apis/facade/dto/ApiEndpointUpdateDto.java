package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.parameters.RequestBody;
import io.swagger.v3.oas.models.responses.ApiResponse;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新接口端点请求参数")
public class ApiEndpointUpdateDto {

  @NotBlank
  @Length(max = 200)
  @Schema(description = "端点名称", requiredMode = RequiredMode.REQUIRED)
  private String name;

  //  @NotNull
  //  @Schema(description = "HTTP方法", requiredMode = RequiredMode.REQUIRED)
  //  private HttpMethod method;
  //
  //  @NotBlank
  //  @Length(max = 800)
  //  @Schema(description = "路径", example = "/v1/chat/completions", requiredMode = RequiredMode.REQUIRED)
  //  private String path;

  @Length(max = 1000)
  @Schema(description = "端点描述")
  private String description;

  //  @Length(max = 200)
  //  @Schema(description = "操作标识符，用于OpenAPI规范解析的唯一标识")
  //  private String operationId;

  @Size(max = 10)
  @Schema(description = "标签列表，用于分类和筛选")
  private List<String> tags;

  @Size(max = 50)
  @Schema(description = "请求参数列表，遵循OpenAPI Parameter Object规范")
  private List<Parameter> parameters;

  @Schema(description = "请求体配置，遵循OpenAPI Request Body Object规范")
  private RequestBody requestBody;

  @Schema(description = "响应配置映射，键为HTTP状态码，值为响应对象，遵循OpenAPI Response Object规范")
  private Map<String, ApiResponse> responses;
}

