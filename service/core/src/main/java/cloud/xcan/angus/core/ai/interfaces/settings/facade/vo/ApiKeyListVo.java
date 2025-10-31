package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyPermission;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyStatus;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ResourceType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

/**
 * API密钥列表VO
 */
@Data
@Schema(description = "API密钥列表项")
public class ApiKeyListVo {

  @Schema(description = "密钥ID")
  private Long id;

  @Schema(description = "密钥名称")
  private String name;

  @Schema(description = "部分可见密钥")
  private String keyVisible;

  @Schema(description = "状态")
  private ApiKeyStatus status;

  @Schema(description = "状态颜色")
  private String statusColor;

  @Schema(description = "权限列表")
  private List<ApiKeyPermission> permissions;

  @Schema(description = "授权资源列表")
  private List<AuthorizedResourceVo> authorizedResources;

  @Schema(description = "速率限制")
  private String rateLimit;

  @Schema(description = "速率限制原始值")
  private Integer rateLimitRaw;

  @Schema(description = "使用次数")
  private Long usageCount;

  @Schema(description = "最后使用时间（格式化）")
  private String lastUsed;

  @Schema(description = "最后使用时间戳")
  private Long lastUsedAt;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "创建时间（格式化）")
  private String created;

  @Schema(description = "过期时间戳")
  private Long expiresAt;

  @Schema(description = "过期时间（格式化）")
  private String expires;

  /**
   * 授权资源VO
   */
  @Data
  @Schema(description = "授权资源")
  public static class AuthorizedResourceVo {

    @Schema(description = "资源类型")
    private ResourceType type;

    @Schema(description = "资源ID列表")
    private List<Long> ids;

    @Schema(description = "资源名称列表")
    private List<String> names;
  }
}
