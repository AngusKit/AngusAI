package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "资源共享统计")
public class ResourceSharingStatisticsVo {

  @Schema(description = "我创建的共享")
  private SharedByMeVo sharedByMe;

  @Schema(description = "共享给我的")
  private SharedToMeVo sharedToMe;

  @Data
  @Schema(description = "我创建的共享统计")
  public static class SharedByMeVo {

    @Schema(description = "总数")
    private Long total;

    @Schema(description = "按类型统计")
    private Map<String, Long> byType;

    @Schema(description = "总访问次数")
    private Long totalViews;

    @Schema(description = "总成员数")
    private Long totalMembers;
  }

  @Data
  @Schema(description = "共享给我的统计")
  public static class SharedToMeVo {

    @Schema(description = "总数")
    private Long total;

    @Schema(description = "按类型统计")
    private Map<String, Long> byType;

    @Schema(description = "最近访问数")
    private Long recentlyAccessed;
  }
}
