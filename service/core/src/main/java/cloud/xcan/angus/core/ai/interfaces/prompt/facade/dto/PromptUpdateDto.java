package cloud.xcan.angus.core.ai.interfaces.prompt.facade.dto;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "更新提示词请求参数")
public class PromptUpdateDto {

  @Size(max = 100, message = "标题长度不能超过100")
  @Schema(description = "提示词标题")
  private String title;

  @Size(max = 5000, message = "内容长度不能超过5000")
  @Schema(description = "提示词内容")
  private String content;

  @Size(max = 500, message = "描述长度不能超过500")
  @Schema(description = "描述")
  private String description;

  @Schema(description = "分类ID")
  private Long categoryId;

  @Schema(description = "标签")
  private JsonNode tags;

  @Schema(description = "是否公开")
  private Boolean isPublic;

  @Schema(description = "变量定义")
  private JsonNode variables;

  @Schema(description = "使用示例")
  private JsonNode examples;

}
