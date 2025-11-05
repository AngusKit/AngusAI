package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "接口集导入结果")
public class ApiCollectionImportVo {

  @Schema(description = "接口集ID")
  private Long collectionId;

  @Schema(description = "名称")
  private String name;

  @Schema(description = "来源")
  private ApiCollectionSource source;

  @Schema(description = "导入统计")
  private ImportStats importStats;

  @Schema(description = "导入详情")
  private List<ImportDetail> importDetails;

  @Data
  @Schema(description = "导入统计")
  public static class ImportStats {
    @Schema(description = "总端点数")
    private Long totalEndpoints;

    @Schema(description = "成功导入")
    private Long importedEndpoints;

    @Schema(description = "跳过（冲突）")
    private Long skippedEndpoints;

    @Schema(description = "错误数")
    private Long errors;
  }

  @Data
  @Schema(description = "导入详情")
  public static class ImportDetail {
    @Schema(description = "端点")
    private String endpoint;

    @Schema(description = "状态", allowableValues = {"imported", "skipped", "error"})
    private String status;

    @Schema(description = "原因")
    private String reason;
  }
}

