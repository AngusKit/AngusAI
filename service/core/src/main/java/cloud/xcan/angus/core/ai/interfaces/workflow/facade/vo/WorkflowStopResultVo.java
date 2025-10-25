package cloud.xcan.angus.core.ai.interfaces.workflow.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "工作流停止结果响应")
public class WorkflowStopResultVo {

  @Schema(description = "已停止的执行ID列表")
  private List<String> stoppedExecutions;
}
