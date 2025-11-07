package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新提示词请求参数")
public class PromptUpdateDto {

  @Length(max = 100)
  @Schema(description = "提示词标题")
  private String title;

  @Length(max = 5000)
  @Schema(description = "提示词内容")
  private String content;

  @Schema(description = "分类ID")
  private Long categoryId;

  @Schema(description = "标签")
  private List<String> tags;

}
