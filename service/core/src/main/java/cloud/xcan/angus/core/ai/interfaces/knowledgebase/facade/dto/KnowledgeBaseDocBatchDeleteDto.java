package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import cloud.xcan.angus.core.ai.domain.Constants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "批量删除文档请求参数")
public class KnowledgeBaseDocBatchDeleteDto {

  @NotEmpty
  @Size(max = Constants.KNOWLEDGE_BASE_BATCH_DELETE_MAX_COUNT)
  @Schema(description = "文档ID列表", example = "[1, 2, 3]", requiredMode = Schema.RequiredMode.REQUIRED)
  private List<Long> documentIds;
}
