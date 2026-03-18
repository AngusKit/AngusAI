package cloud.xcan.angus.core.ai.interfaces.monitor.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Schema(description = "对话监控统计概览")
public class ChatMonitorOverviewVo {

  @Schema(description = "吞吐量统计（消息/分钟）")
  private ThroughputStatsVo throughput;

  @Schema(description = "会话统计")
  private DualStatsVo sessions;

  @Schema(description = "消息统计")
  private DualStatsVo messages;

  @Schema(description = "用户统计")
  private DualStatsVo users;

  @Schema(description = "反馈统计")
  private FeedbackStatsVo feedback;

  @Schema(description = "应用统计")
  private DualStatsVo applications;

  @Schema(description = "智能体统计")
  private DualStatsVo agents;

  @Schema(description = "模型统计")
  private DualStatsVo models;

  @Data
  @Schema(description = "吞吐量统计")
  public static class ThroughputStatsVo {

    @Schema(description = "当前值")
    private double current;

    @Schema(description = "最小值")
    private double min;

    @Schema(description = "最大值")
    private double max;

    @Schema(description = "平均值")
    private double average;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Schema(description = "双值统计（活跃/总数）")
  public static class DualStatsVo {

    @Schema(description = "活跃数")
    private long active;

    @Schema(description = "总数")
    private long total;
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Schema(description = "反馈统计")
  public static class FeedbackStatsVo {

    @Schema(description = "点赞数")
    private long like;

    @Schema(description = "点踩数")
    private long dislike;

    @Schema(description = "总反馈数")
    private long total;
  }
}
