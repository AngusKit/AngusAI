package cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "复制插件请求参数")
public class PluginDuplicateDto {

  @NotBlank(message = "插件名称不能为空")
  @Length(max = 100)
  @Schema(description = "新插件名称", example = "天气查询插件（副本）", required = true)
  private String name;

  @Schema(description = "是否复制配置", example = "true")
  private Boolean copyConfig = true;

  @Schema(description = "是否复制权限", example = "true")
  private Boolean copyPermissions = true;

  @Schema(description = "是否复制标签", example = "true")
  private Boolean copyTags = true;
}
