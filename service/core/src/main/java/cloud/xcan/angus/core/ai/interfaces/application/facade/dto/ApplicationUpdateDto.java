package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import cloud.xcan.angus.core.ai.domain.application.ApplicationCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新应用基本信息请求参数")
public class ApplicationUpdateDto {

  @Length(max = 50)
  @Schema(description = "应用名称", example = "我的智能助手")
  private String name;

  @Schema(description = "应用图标（emoji或URL）", example = "🤖")
  private String icon;

  @Length(max = 400)
  @Schema(description = "应用描述", example = "这是一个智能助手应用")
  private String description;

  @Schema(description = "应用分类")
  private ApplicationCategory category;

  @Length(max = 20)
  @Schema(description = "默认语言", example = "zh-CN")
  private String language;
}
