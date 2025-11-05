package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import cloud.xcan.angus.core.ai.domain.Visibility;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建接口集请求参数")
public class ApiCollectionCreateDto {

  @NotBlank
  @Length(max = 100)
  @Schema(description = "接口集名称", required = true)
  private String name;

  @Length(max = 500)
  @Schema(description = "描述")
  private String description;

  @Schema(description = "可见性", example = "PRIVATE")
  private Visibility visibility = Visibility.PRIVATE;

  @Valid
  @Schema(description = "服务器配置")
  private ServerConfigDto serverConfig;

  @Valid
  @Schema(description = "安全配置")
  private Map<String, Object> securityConfig;

  @Data
  @Schema(description = "服务器配置")
  public static class ServerConfigDto {
    @Schema(description = "服务器地址", example = "https://api.example.com")
    private String url;

    @Schema(description = "描述")
    private String description;
  }
}

