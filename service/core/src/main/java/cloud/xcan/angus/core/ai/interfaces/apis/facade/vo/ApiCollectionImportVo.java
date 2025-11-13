package cloud.xcan.angus.core.ai.interfaces.apis.facade.vo;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import io.swagger.v3.oas.annotations.media.Schema;
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

}

