package cloud.xcan.angus.core.ai.interfaces.setting.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

/**
 * 删除账户请求参数
 */
@Data
@Schema(description = "删除账户请求参数")
public class DeleteAccountDto {

  @NotBlank
  @Schema(description = "确认密码")
  private String password;

  @Length(max = 500)
  @Schema(description = "删除原因")
  private String reason;

  @Length(max = 1000)
  @Schema(description = "反馈")
  private String feedback;
}
