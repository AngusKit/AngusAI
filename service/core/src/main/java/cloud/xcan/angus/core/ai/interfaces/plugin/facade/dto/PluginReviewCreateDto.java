package cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "创建插件评级请求体")
public class PluginReviewCreateDto {

  @NotNull
  @Min(1)
  @Max(5)
  @Schema(description = "评分星级（1-5）")
  private Integer rating;

  @Size(max = 200)
  @Schema(description = "评价内容（最长200字符）")
  private String content;
}
