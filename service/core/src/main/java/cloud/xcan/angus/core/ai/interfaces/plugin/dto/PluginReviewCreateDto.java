package cloud.xcan.angus.core.ai.interfaces.plugin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "创建插件评级请求体")
public class PluginReviewCreateDto {

  @NotNull
  @Min(1)
  @Max(5)
  @Schema(description = "评分星级（1-5）")
  private Integer rating;

  @Schema(description = "评价内容")
  private String content;

  @NotNull
  @Schema(description = "评价人ID")
  private Long reviewerId;
}

