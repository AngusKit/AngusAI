package cloud.xcan.angus.core.ai.interfaces.agent.facade.dto;

import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "智能体列表查询参数")
public class AgentFindDto extends PageQuery {

  @Schema(description = "智能体名称")
  private String name;

  @Schema(description = "状态筛选")
  private AgentStatus status;

  @Schema(description = "交互模式筛选")
  private InteractionMode interactionMode;

}
