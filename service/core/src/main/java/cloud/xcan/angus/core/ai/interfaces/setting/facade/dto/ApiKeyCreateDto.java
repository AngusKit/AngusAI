package cloud.xcan.angus.core.ai.interfaces.setting.facade.dto;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyPermission;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ResourceType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

/**
 * 创建API密钥DTO
 */
@Data
@Schema(description = "创建API密钥请求")
public class ApiKeyCreateDto {

  @NotBlank(message = "密钥名称不能为空")
  @Size(max = 100, message = "密钥名称长度不能超过100")
  @Schema(description = "密钥名称", example = "全权限API密钥")
  private String name;

  @Size(max = 500, message = "描述长度不能超过500")
  @Schema(description = "密钥描述", example = "用于生产环境的API访问")
  private String description;

  @NotEmpty(message = "至少需要选择一个权限")
  @Schema(description = "权限列表", example = "[\"READ\", \"WRITE\"]")
  private List<ApiKeyPermission> permissions;

  @Schema(description = "授权资源列表")
  private List<AuthorizedResourceDto> authorizedResources;

  @Schema(description = "速率限制（次/分钟）", example = "1000")
  private Integer rateLimit = 1000;

  @Schema(description = "每日限额", example = "100000")
  private Integer dailyLimit;

  @Schema(description = "IP白名单")
  private List<String> ipWhitelist;

  @Schema(description = "有效期（天数）", example = "365")
  private Integer expiresIn = 365;

  @Schema(description = "是否永不过期", example = "false")
  private Boolean neverExpires = false;

  /**
   * 授权资源DTO
   */
  @Data
  @Schema(description = "授权资源")
  public static class AuthorizedResourceDto {

    @Schema(description = "资源类型", example = "APPLICATION")
    private ResourceType type;

    @Schema(description = "资源ID列表（空数组表示全部）", example = "[]")
    private List<Long> ids;
  }
}
