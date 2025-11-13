package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.core.ai.domain.apis.ConflictStrategy;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Schema(description = "导入接口集请求参数")
public class ApiCollectionImportDto {

  @NotNull
  @Schema(description = "文件类型", requiredMode = RequiredMode.REQUIRED, allowableValues = {
      "OPENAPI", "SWAGGER", "POSTMAN"})
  private ApiCollectionSource type;

  @Schema(description = "上传的接口内容，和接口文件必须指定其中一个，大小不超过20MB")
  private String content;

  @Schema(description = "上传的接口文件，和接口内容必须指定其中一个，大小不超过20MB")
  private MultipartFile file;

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

