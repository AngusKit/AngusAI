package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.core.ai.domain.apis.ApiEndpoint.HttpMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "接口端点详情")
public class ApiEndpointVo {

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

  @Schema(description = "最后使用时间戳")
  private Long lastUsedAt;

  @Schema(description = "最后使用日期")
  private String lastUsedDate;

  @Schema(description = "使用次数")
  private Long usageCount;
}

