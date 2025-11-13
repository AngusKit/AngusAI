package cloud.xcan.angus.core.ai.domain.apis;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "导入策略")
public class ImportApiStrategy {

  @Schema(description = "冲突处理策略：OVERWRITE-覆盖现有接口，IGNORE-跳过重复接口，MERGE-合并配置", example = "IGNORE")
  private ConflictStrategy conflictStrategy = ConflictStrategy.IGNORE;

  //    @Schema(description = "是否导入安全配置", example = "true")
  //    private Boolean importSecurity = true;
  //
  //    @Schema(description = "是否导入服务器配置", example = "true")
  //    private Boolean importServers = true;
  //
  //    @Schema(description = "是否导入标签", example = "true")
  //    private Boolean importTags = true;

  @Schema(description = "默认启用所有接口", example = "true")
  private Boolean enableByDefault = true;

}
