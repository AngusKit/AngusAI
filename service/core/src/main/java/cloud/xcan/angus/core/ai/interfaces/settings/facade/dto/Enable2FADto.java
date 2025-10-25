package cloud.xcan.angus.core.ai.interfaces.settings.facade.dto;

import cloud.xcan.angus.core.ai.domain.settings.TwoFactorMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 启用双因素认证请求参数
 */
@Data
@Schema(description = "启用双因素认证请求参数")
public class Enable2FADto {

  @NotNull
  @Schema(description = "双因素认证方法", example = "TOTP")
  private TwoFactorMethod method;
}
