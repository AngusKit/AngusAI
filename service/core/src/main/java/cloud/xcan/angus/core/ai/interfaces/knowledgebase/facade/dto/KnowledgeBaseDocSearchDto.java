package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto;

import cloud.xcan.angus.core.ai.domain.Constants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "文档检索请求参数")
public class KnowledgeBaseDocSearchDto {

  @NotBlank
  @Schema(description = "检索查询", example = "产品功能介绍", requiredMode = Schema.RequiredMode.REQUIRED)
  private String keyword;

  @Min(value = Constants.SEARCH_LIMIT_MIN_VALUE)
  @Max(value = Constants.SEARCH_LIMIT_MAX_VALUE)
  @Schema(description = "返回数量", example = "5")
  private Integer limit = 5;

  @Min(value = (int) Constants.SIMILARITY_THRESHOLD_MIN_VALUE)
  @Max(value = (int) Constants.SIMILARITY_THRESHOLD_MAX_VALUE)
  @Schema(description = "相似度阈值", example = "0.7")
  private Double threshold = 0.7;

}
