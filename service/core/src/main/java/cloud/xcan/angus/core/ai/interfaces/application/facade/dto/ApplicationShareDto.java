package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "应用分享请求参数，访问设置全部为false时，只允许自己访问")
public class ApplicationShareDto {

  @Schema(description = "公开访问：允许任何人通过链接访问应用")
  private boolean publicAccess = true;

  @Schema(description = "匿名访问：允许未登录用户访问应用")
  private boolean anonymousAccess = false;

  @Schema(description = "授权访问：只有授权用户才可访问")
  private boolean authorizationRequired = true;

  @Min(value = 0, message = "有效期不能小于0")
  @Schema(description = "有效期（小时），0表示永久", example = "24")
  private int expiresIn = 0;

}
