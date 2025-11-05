package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint.HttpMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新接口端点请求参数")
public class ApiEndpointUpdateDto {

  @Length(max = 200)
  @Schema(description = "端点名称")
  private String name;

  @Schema(description = "HTTP方法")
  private HttpMethod method;

  @Length(max = 500)
  @Schema(description = "路径")
  private String path;

  @Length(max = 1000)
  @Schema(description = "描述")
  private String description;

  @Length(max = 100)
  @Schema(description = "分类")
  private String category;

  @Schema(description = "标签")
  private List<String> tags;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "请求配置")
  private Map<String, Object> requestConfig;

  @Schema(description = "响应配置")
  private Map<String, Object> responseConfig;
}

