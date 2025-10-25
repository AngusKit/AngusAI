package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import cloud.xcan.angus.core.ai.domain.settings.TwoFactorMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

/**
 * 启用双因素认证响应
 */
@Data
@Schema(description = "启用双因素认证响应")
public class Enable2FAVo {

  @Schema(description = "TOTP设置")
  private TotpVo totp;

  @Schema(description = "是否发送验证码")
  private Boolean verificationCodeSent;

  @Data
  @Schema(description = "TOTP设置")
  public static class TotpVo {

    @Schema(description = "密钥")
    private String secret;

    @Schema(description = "二维码URL")
    private String qrCode;

    @Schema(description = "备用码列表")
    private List<String> backupCodes;
  }
}
