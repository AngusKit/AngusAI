package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建接口集请求参数")
public class ApiCollectionCreateDto {

  @NotBlank
  @Length(max = 100)
  @Schema(description = "接口集名称", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @Length(max = 500)
  @Schema(description = "接口集描述")
  private String description;

  @Schema(description = "可见性：PRIVATE-私有，TEAM-团队，PUBLIC-公开", example = "PRIVATE")
  private Visibility visibility = Visibility.PRIVATE;

}

