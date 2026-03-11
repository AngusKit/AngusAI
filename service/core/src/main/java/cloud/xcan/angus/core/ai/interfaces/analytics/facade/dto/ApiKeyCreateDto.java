package cloud.xcan.angus.core.ai.interfaces.analytics.facade.dto;

import cloud.xcan.angus.core.ai.domain.apikey.ApiKeyPermission;
import cloud.xcan.angus.core.ai.domain.apikey.AuthorizedResource;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

/**
 * 创建API密钥DTO
 */
@Data
@Schema(description = "创建API密钥请求")
public class ApiKeyCreateDto {

  @NotBlank
  @Length(max = 100)
  @Schema(description = "密钥名称", example = "全权限API密钥")
  private String name;

  @NotEmpty
  @Schema(description = "权限列表", example = "[\"READ\", \"WRITE\"]")
  private List<ApiKeyPermission> permissions;

  @Schema(description = "授权资源列表")
  private List<AuthorizedResource> authorizedResources;

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

}
