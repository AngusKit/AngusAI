package cloud.xcan.angus.core.ai.interfaces.setting.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 验证双因素认证请求参数
 */
@Data
@Schema(description = "验证双因素认证请求参数")
public class Verify2FADto {

  @NotBlank
  @Size(min = 6, max = 6)
  @Schema(description = "验证码", example = "123456")
  private String code;
}
