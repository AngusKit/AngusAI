package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新接口集请求参数")
public class ApiCollectionUpdateDto {

  @Length(max = 100)
  @Schema(description = "接口集名称")
  private String name;

  @Length(max = 500)
  @Schema(description = "描述")
  private String description;

  @Schema(description = "可见性")
  private Visibility visibility;

  @Valid
  @Schema(description = "服务器配置")
  private ApiCollectionCreateDto.ServerConfigDto serverConfig;

  @Schema(description = "安全配置")
  private Map<String, Object> securityConfig;
}

