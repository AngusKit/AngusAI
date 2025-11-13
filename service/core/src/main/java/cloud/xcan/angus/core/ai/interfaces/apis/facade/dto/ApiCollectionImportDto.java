package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.apis.ApiCollectionSource;
import cloud.xcan.angus.core.ai.domain.apis.ImportApiStrategy;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
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

  @Length(max = 100)
  @Schema(description = "自定义名称（不填则使用文件中的名称）")
  private String name;

  @Schema(description = "可见性")
  private Visibility visibility = Visibility.PRIVATE;

  @Valid
  @Schema(description = "导入策略")
  private ImportApiStrategy importStrategy = new ImportApiStrategy();

}

