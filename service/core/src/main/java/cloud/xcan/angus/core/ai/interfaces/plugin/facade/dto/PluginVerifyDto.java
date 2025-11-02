package cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto;

import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

@Data
@Schema(description = "创建插件请求参数")
public class PluginVerifyDto {

  @NotBlank
  @Length(max = 100)
  @Schema(description = "插件名称", example = "天气查询插件", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Length(max = 20)
  @Schema(description = "版本号", example = "1.0.0", requiredMode = RequiredMode.REQUIRED)
  private String version;

  @NotNull(message = "插件分类不能为空")
  @Schema(description = "插件分类", requiredMode = RequiredMode.REQUIRED)
  private PluginCategory category;

  @NotNull(message = "插件类型不能为空")
  @Schema(description = "插件类型", requiredMode = RequiredMode.REQUIRED)
  private PluginType type;

  @NotNull
  @Schema(type = "string", format = "binary", description = "插件规范文件，最大支持200MB", requiredMode = RequiredMode.REQUIRED)
  private MultipartFile file;

}
