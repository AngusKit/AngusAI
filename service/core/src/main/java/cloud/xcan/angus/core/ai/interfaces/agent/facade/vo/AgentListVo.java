package cloud.xcan.angus.core.ai.interfaces.agent.facade.vo;

import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "智能体列表项")
public class AgentListVo extends TenantAuditingVo {

  @Schema(description = "智能体ID")
  private Long id;

  @Schema(description = "名称")
  private String name;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "状态")
  private AgentStatus status;

  @Schema(description = "交互模式")
  private InteractionMode interactionMode;

  @Schema(description = "模型ID")
  private Long modelId;
}
