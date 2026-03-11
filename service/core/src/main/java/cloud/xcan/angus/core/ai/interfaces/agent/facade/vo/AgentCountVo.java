package cloud.xcan.angus.core.ai.interfaces.agent.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "智能体数量统计")
public class AgentCountVo {

  @Schema(description = "智能体总数")
  private long total;

  @Schema(description = "已发布数")
  private long active;

  @Schema(description = "离线数")
  private long inactive;
}
