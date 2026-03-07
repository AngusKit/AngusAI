package cloud.xcan.angus.core.ai.interfaces.agent.facade.dto;

import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.remote.PageQuery;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "智能体列表查询参数")
public class AgentFindDto extends PageQuery {

  @Schema(description = "关键词（名称/描述模糊搜索）")
  private String keyword;

  @Schema(description = "状态筛选")
  private AgentStatus status;

  @Schema(description = "交互模式筛选")
  private InteractionMode interactionMode;

  @Schema(description = "是否仅查询可绑定的（用于应用配置页选择器）")
  private Boolean bindable;
}
