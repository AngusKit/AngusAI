package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import cloud.xcan.angus.core.ai.domain.settings.ExportFormat;
import cloud.xcan.angus.core.ai.domain.settings.ExportStatus;
import cloud.xcan.angus.core.ai.domain.settings.ExportType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * 数据导出记录详情
 */
@Data
@Schema(description = "数据导出记录详情")
public class DataExportVo {

  @Schema(description = "导出ID")
  private Long id;

  @Schema(description = "导出类型")
  private ExportType type;

  @Schema(description = "导出格式")
  private ExportFormat format;

  @Schema(description = "导出状态")
  private ExportStatus status;

  @Schema(description = "导出范围")
  private ExportScopeVo scope;

  @Schema(description = "文件大小")
  private Long fileSize;

  @Schema(description = "下载链接")
  private String downloadUrl;

  @Schema(description = "过期时间")
  private LocalDateTime expiresAt;

  @Schema(description = "请求时间")
  private LocalDateTime requestedAt;

  @Schema(description = "完成时间")
  private LocalDateTime completedAt;

  @Data
  @Schema(description = "导出范围")
  public static class ExportScopeVo {
    private Boolean applications;
    private Boolean workflows;
    private Boolean datasets;
    private Boolean knowledge;
    private Boolean conversations;
  }
}
