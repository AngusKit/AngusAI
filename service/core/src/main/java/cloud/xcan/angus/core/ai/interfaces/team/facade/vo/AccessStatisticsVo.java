package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "统计信息")
public class AccessStatisticsVo {

  @Schema(description = "总访问次数")
  private Long totalViews;

  @Schema(description = "总编辑次数")
  private Long totalEdits;

  @Schema(description = "独立访客数")
  private Long uniqueVisitors;

  @Schema(description = "平均每用户访问次数")
  private Double avgAccessesPerUser;

  @Schema(description = "访问趋势")
  private List<ViewTrendVo> viewTrend;

  @Data
  @Schema(description = "访问趋势")
  public static class ViewTrendVo {

    @Schema(description = "日期")
    private String date;

    @Schema(description = "访问次数")
    private Long views;

    @Schema(description = "用户数")
    private Long users;
  }
}
