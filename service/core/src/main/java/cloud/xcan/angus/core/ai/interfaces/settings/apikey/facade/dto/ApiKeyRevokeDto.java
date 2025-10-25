package cloud.xcan.angus.core.ai.interfaces.settings.apikey.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 撤销API密钥DTO
 */
@Data
@Schema(description = "撤销API密钥请求")
public class ApiKeyRevokeDto {

  @Schema(description = "撤销原因", example = "密钥泄露")
  private String reason;
}
