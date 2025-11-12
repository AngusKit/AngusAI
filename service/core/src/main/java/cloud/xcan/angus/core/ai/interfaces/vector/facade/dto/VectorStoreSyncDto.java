package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "同步向量数据请求参数")
public class VectorStoreSyncDto {

  @Schema(description = "是否全量同步", example = "false")
  private Boolean fullSync = false;
}

