package cloud.xcan.angus.core.ai.interfaces.settings.facade.dto;

import cloud.xcan.angus.core.ai.domain.settings.ExportFormat;
import cloud.xcan.angus.core.ai.domain.settings.ExportType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 数据导出请求参数
 */
@Data
@Schema(description = "数据导出请求参数")
public class DataExportRequestDto {

  @NotNull
  @Schema(description = "导出类型", example = "FULL")
  private ExportType type;

  @NotNull
  @Schema(description = "导出格式", example = "JSON")
  private ExportFormat format;

  @Schema(description = "导出范围")
  private ExportScopeDto scope;

  @Data
  @Schema(description = "导出范围")
  public static class ExportScopeDto {

    @Schema(description = "是否包含应用", example = "true")
    private Boolean applications;

    @Schema(description = "是否包含工作流", example = "true")
    private Boolean workflows;

    @Schema(description = "是否包含数据集", example = "true")
    private Boolean datasets;

    @Schema(description = "是否包含知识库", example = "true")
    private Boolean knowledge;

    @Schema(description = "是否包含对话", example = "true")
    private Boolean conversations;
  }
}
