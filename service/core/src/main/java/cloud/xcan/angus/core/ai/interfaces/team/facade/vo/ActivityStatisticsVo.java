package cloud.xcan.angus.core.ai.interfaces.team.facade.vo;

import java.util.List;
import lombok.Data;

@Data
public class ActivityStatisticsVo {

  private Overview overview;
  private List<ActionTypeDistribution> actionTypeDistribution;
  private List<ResourceTypeDistribution> resourceTypeDistribution;
  private StatusDistribution statusDistribution;
  private List<TopUser> topActiveUsers;
  private List<TimeTrend> timeTrend;
  private List<TopResource> topResources;

  @Data
  public static class Overview {

    private Long totalActivities;
    private Long todayActivities;
    private Long activeUsers;
    private Double successRate; // 百分比，例如 92.5
  }

  @Data
  public static class ActionTypeDistribution {

    private String actionType;
    private String actionTypeLabel;
    private Long count;
    private Double percentage;
  }

  @Data
  public static class ResourceTypeDistribution {

    private String resourceType;
    private String resourceTypeLabel;
    private Long count;
    private Double percentage;
  }

  @Data
  public static class StatusDistribution {

    private Long success;
    private Long failed;
    private Long warning;
  }

  @Data
  public static class TopUser {

    private Long userId;
    private String userName;
    private String userAvatar;
    private Long activityCount;
    private String lastActivityDate; // 格式: yyyy-MM-dd HH:mm:ss
  }

  @Data
  public static class TimeTrend {

    private Long timestamp;
    private String date; // 按天或小时格式
    private Long count;
    private Long successCount;
    private Long failedCount;
  }

  @Data
  public static class TopResource {

    private Long resourceId;
    private String resourceType;
    private String resourceName;
    private Long operationCount;
    private String lastOperationDate;
  }
}
