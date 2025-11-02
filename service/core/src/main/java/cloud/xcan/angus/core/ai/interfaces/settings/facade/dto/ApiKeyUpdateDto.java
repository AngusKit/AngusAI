package cloud.xcan.angus.core.ai.interfaces.settings.facade.dto;

import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyPermission;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ResourceType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

/**
 * 更新API密钥DTO
 */
@Data
@Schema(description = "更新API密钥请求")
public class ApiKeyUpdateDto {

  @Size(max = 100, message = "密钥名称长度不能超过100")
  @Schema(description = "密钥名称")
  private String name;

  @Size(max = 500, message = "描述长度不能超过500")
  @Schema(description = "密钥描述")
  private String description;

  @Schema(description = "权限列表")
  private List<ApiKeyPermission> permissions;

  @Schema(description = "授权资源列表")
  private List<AuthorizedResourceDto> authorizedResources;

  @Schema(description = "速率限制（次/分钟）")
  private Integer rateLimit;

  @Schema(description = "每日限额")
  private Integer dailyLimit;

  @Schema(description = "IP白名单")
  private List<String> ipWhitelist;

  @Schema(description = "过期时间戳")
  private Long expiresAt;

  /**
   * 授权资源DTO
   */
  @Data
  @Schema(description = "授权资源")
  public static class AuthorizedResourceDto {

    @Schema(description = "资源类型")
    private ResourceType type;

    @Schema(description = "资源ID列表（空数组表示全部）")
    private List<Long> ids;
  }
}
