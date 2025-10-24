package cloud.xcan.angus.core.ai.domain.application;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Schema(description = "分享信息")
public class ApplicationShare {

  @Schema(description = "公开访问：允许任何人通过链接访问应用")
  private boolean publicAccess = true;

  @Schema(description = "匿名访问：允许未登录用户访问应用")
  private boolean anonymousAccess = false;

  @Schema(description = "授权访问：只有授权用户才可访问")
  private boolean authorizationRequired = true;

  @Schema(description = "分享ID")
  private String shareId;

  @Schema(description = "分享链接")
  private String shareUrl;

  @Schema(description = "二维码图片URL")
  private String qrCode;

  @Schema(description = "过期时间")
  private LocalDateTime expiresAt;

}
