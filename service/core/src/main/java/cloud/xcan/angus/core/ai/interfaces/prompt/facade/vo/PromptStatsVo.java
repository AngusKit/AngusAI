package cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "提示词统计信息")
public class PromptStatsVo {

  @Schema(description = "总使用次数")
  private Long totalUses;

  @Schema(description = "收藏次数")
  private Long favorites;

}
