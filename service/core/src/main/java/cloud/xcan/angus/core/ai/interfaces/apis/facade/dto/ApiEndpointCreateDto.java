package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint.HttpMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建接口端点请求参数")
public class ApiEndpointCreateDto {

  @NotBlank
  @Length(max = 200)
  @Schema(description = "端点名称", required = true)
  private String name;

  @NotNull
  @Schema(description = "HTTP方法", required = true, allowableValues = {"GET", "POST", "PUT", "DELETE", "PATCH"})
  private HttpMethod method;

  @NotBlank
  @Length(max = 500)
  @Schema(description = "路径", required = true, example = "/v1/chat/completions")
  private String path;

  @Length(max = 1000)
  @Schema(description = "描述")
  private String description;

  @Length(max = 100)
  @Schema(description = "分类")
  private String category;

  @Schema(description = "标签")
  private List<String> tags;

  @Schema(description = "是否启用", example = "true")
  private Boolean enabled = true;

  @Schema(description = "请求配置")
  private Map<String, Object> requestConfig;

  @Schema(description = "响应配置")
  private Map<String, Object> responseConfig;
}

