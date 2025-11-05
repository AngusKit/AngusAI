package cloud.xcan.angus.core.ai.interfaces.apis.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "安全配置请求参数")
public class SecurityConfigDto {

  @NotBlank
  @Schema(description = "认证类型", required = true, allowableValues = {
      "API_KEY", "HTTP_BASIC", "BEARER", "OAUTH2_PASSWORD", "OAUTH2_CLIENT", "CUSTOM"
  })
  private String type;

  @Schema(description = "配置详情", required = true)
  private Object config;
}

