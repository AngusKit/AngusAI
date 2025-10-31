package cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo;

import cloud.xcan.angus.remote.NameJoinField;
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

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "创建者姓名")
  @NameJoinField(id = "createdBy", repository = "commonUserBaseRepo")
  private String creator;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;
}

