package cloud.xcan.angus.core.ai.interfaces.plugin.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Schema(description = "插件评级记录")
public class PluginReviewVo {
  private Long id;
  private Long pluginId;
  private Integer rating;
  private String content;
  private LocalDateTime reviewedAt;
  private Long reviewerId;
  private Long createdBy;
  private LocalDateTime createdDate;
}

