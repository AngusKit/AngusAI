package cloud.xcan.angus.core.ai.interfaces.application.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "应用数量统计")
public class ApplicationCountVo {

  @Schema(description = "应用总数")
  private long total;

  @Schema(description = "草稿数")
  private long draft;

  @Schema(description = "已发布数")
  private long published;

  @Schema(description = "已暂停数")
  private long paused;

  @Schema(description = "标星数")
  private long starred;
}
