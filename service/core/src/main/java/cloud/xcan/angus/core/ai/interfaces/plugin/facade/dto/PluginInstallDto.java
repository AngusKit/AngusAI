package cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "插件安装请求参数")
public class PluginInstallDto {

  @Schema(description = "安装配置")
  private java.util.Map<String, Object> config;

  @Schema(description = "是否启用", example = "true")
  private Boolean enabled = true;

  @Schema(description = "是否自动更新", example = "false")
  private Boolean autoUpdate = false;
}
