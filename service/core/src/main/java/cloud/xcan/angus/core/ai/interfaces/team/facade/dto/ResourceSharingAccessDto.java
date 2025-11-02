package cloud.xcan.angus.core.ai.interfaces.team.facade.dto;

import cloud.xcan.angus.core.ai.domain.team.resourcesharing.ShareAction;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "记录访问日志参数")
public class ResourceSharingAccessDto {

  @NotNull(message = "操作类型不能为空")
  @Schema(description = "操作类型", required = true)
  private ShareAction action;

  @Schema(description = "元数据")
  private Map<String, Object> metadata;
}
