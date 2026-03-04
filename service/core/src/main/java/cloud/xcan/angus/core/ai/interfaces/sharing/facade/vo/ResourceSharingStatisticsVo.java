package cloud.xcan.angus.core.ai.interfaces.sharing.facade.vo;

import cloud.xcan.angus.core.ai.domain.sharing.SharePermission;
import cloud.xcan.angus.core.ai.interfaces.activity.facade.vo.AccessStatisticsVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "资源共享统计")
public class ResourceSharingStatisticsVo {

  @Schema(description = "总共享数")
  private Long totalSharing;

  @Schema(description = "总共享资源数")
  private Long totalResources;

  @Schema(description = "总访问次数")
  private Long totalAccesses;

  @Schema(description = "共享资源平均授权权限")
  private SharePermission avgPermission;

  @Schema(description = "共享资源访问统计")
  private AccessStatisticsVo accessStats;

  // TODO 近一月固定增长数和占比（所有前端页面统计数据实现应该保持一致）

}
