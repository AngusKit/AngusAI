package cloud.xcan.angus.core.ai.interfaces.chat.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

/**
 * 对话统计VO
 */
@Data
@Schema(description = "对话统计数据")
public class ChatStatisticsVo {

  @Schema(description = "总会话数")
  private Long totalSessions;

  @Schema(description = "总消息数")
  private Long totalMessages;

  @Schema(description = "总Token数")
  private Long totalTokens;

  @Schema(description = "总成本")
  private BigDecimal totalCost;

  @Schema(description = "今日统计")
  private TodayStats todayStats;

  @Schema(description = "使用趋势")
  private List<UsageTrend> usageTrend;

  @Schema(description = "Top应用")
  private List<TopApp> topApps;

  @Schema(description = "Top模型")
  private List<TopModel> topModels;

  @Data
  @Schema(description = "今日统计")
  public static class TodayStats {

    @Schema(description = "会话数")
    private Long sessions;

    @Schema(description = "消息数")
    private Long messages;

    @Schema(description = "Token数")
    private Long tokens;

    @Schema(description = "成本")
    private BigDecimal cost;
  }

  @Data
  @Schema(description = "使用趋势")
  public static class UsageTrend {

    @Schema(description = "日期")
    private String date;

    @Schema(description = "会话数")
    private Long sessions;

    @Schema(description = "消息数")
    private Long messages;

    @Schema(description = "Token数")
    private Long tokens;
  }

  @Data
  @Schema(description = "Top应用")
  public static class TopApp {

    @Schema(description = "应用ID")
    private Long appId;

    @Schema(description = "应用名称")
    private String appName;

    @Schema(description = "消息数量")
    private Long messageCount;

    @Schema(description = "占比")
    private Double percentage;
  }

  @Data
  @Schema(description = "Top模型")
  public static class TopModel {

    @Schema(description = "模型ID")
    private Long modelId;

    @Schema(description = "模型名称")
    private String modelName;

    @Schema(description = "消息数量")
    private Long messageCount;

    @Schema(description = "Token数量")
    private Long tokens;
  }
}
