package cloud.xcan.angus.core.ai.interfaces.notification.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@Schema(description = "通知统计数据")
public class NotificationStatisticsVo {

  @Schema(description = "总数")
  private Long total;

  @Schema(description = "未读数")
  private Long unread;

  @Schema(description = "星标数")
  private Long starred;

  @Schema(description = "归档数")
  private Long archived;

  @Schema(description = "今日新增")
  private Long todayNew;

  @Schema(description = "相比昨日新增")
  private Long comparedYesterday;

  @Schema(description = "按类型统计")
  private Map<String, Long> byType;

  @Schema(description = "按优先级统计")
  private Map<String, Long> byPriority;

  @Schema(description = "按分类统计")
  private Map<String, Long> byCategory;
}
