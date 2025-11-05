package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "OpenAPI导出结果")
public class OpenApiExportVo {

  @Schema(description = "OpenAPI规范内容")
  private String spec;

  @Schema(description = "导出格式", allowableValues = {"json", "yaml"})
  private String format;

  @Schema(description = "下载链接（可选）")
  private String downloadUrl;
}

