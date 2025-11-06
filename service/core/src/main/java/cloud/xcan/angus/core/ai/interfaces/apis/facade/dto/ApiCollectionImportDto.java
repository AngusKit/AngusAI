package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.core.ai.domain.apis.ConflictStrategy;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

@Data
@Schema(description = "导入接口集请求参数")
public class ApiCollectionImportDto {

  @NotNull
  @Schema(description = "上传的文件", requiredMode = RequiredMode.REQUIRED)
  private MultipartFile file;

  @NotNull
  @Schema(description = "文件类型", requiredMode = RequiredMode.REQUIRED, allowableValues = {
      "OPENAPI", "SWAGGER", "POSTMAN"})
  private ApiCollectionSource type;

  @Length(max = 100)
  @Schema(description = "自定义名称（不填则使用文件中的名称）")
  private String name;

  @Schema(description = "可见性")
  private Visibility visibility = Visibility.PRIVATE;

  @Schema(description = "导入策略")
  private ImportStrategyDto importStrategy;

  @Data
  @Schema(description = "导入策略")
  public static class ImportStrategyDto {

    @Schema(description = "冲突处理策略：OVERWRITE-覆盖现有接口，IGNORE-跳过重复接口，MERGE-合并配置", example = "IGNORE")
    private ConflictStrategy conflictStrategy = ConflictStrategy.IGNORE;

    @Schema(description = "是否导入安全配置", example = "true")
    private Boolean importSecurity = true;

    @Schema(description = "是否导入服务器配置", example = "true")
    private Boolean importServers = true;

    @Schema(description = "是否导入标签", example = "true")
    private Boolean importTags = true;

    @Schema(description = "默认启用所有接口", example = "false")
    private Boolean enableByDefault = false;
  }
}

