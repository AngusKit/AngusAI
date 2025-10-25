package cloud.xcan.angus.core.ai.interfaces.settings.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 修改密码请求参数
 */
@Data
@Schema(description = "修改密码请求参数")
public class ChangePasswordDto {

  @NotBlank
  @Schema(description = "当前密码", example = "oldPassword123")
  private String currentPassword;

  @NotBlank
  @Size(min = 8, max = 50)
  @Schema(description = "新密码", example = "newPassword123!")
  private String newPassword;

  @NotBlank
  @Schema(description = "确认新密码", example = "newPassword123!")
  private String confirmPassword;
}
