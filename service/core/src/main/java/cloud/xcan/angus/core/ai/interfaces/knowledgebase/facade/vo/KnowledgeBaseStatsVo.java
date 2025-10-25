package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "知识库统计信息")
public class KnowledgeBaseStatsVo {

  @Schema(description = "总文档数", example = "15")
  private Integer totalDocuments;

  @Schema(description = "已启用文档数", example = "12")
  private Integer activeDocuments;

  @Schema(description = "总分段数", example = "120")
  private Integer totalChunks;

  @Schema(description = "平均分段大小", example = "512")
  private Integer avgChunkSize;
}
