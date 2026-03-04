package cloud.xcan.angus.core.ai.domain.sharing;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ResourceInfo {

  @Schema(description = "资源ID")
  private Long resourceId;

  @Schema(description = "资源类型")
  private ResourceType resourceType;

  @Schema(description = "资源名称")
  private String resourceName;
}
