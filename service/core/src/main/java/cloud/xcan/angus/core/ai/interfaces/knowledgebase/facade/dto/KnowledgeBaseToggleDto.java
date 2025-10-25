package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "知识库启用状态切换请求参数")
public class KnowledgeBaseToggleDto {

  @NotNull
  @Schema(description = "启用状态", example = "true", requiredMode = Schema.RequiredMode.REQUIRED)
  private Boolean enabled;

}
