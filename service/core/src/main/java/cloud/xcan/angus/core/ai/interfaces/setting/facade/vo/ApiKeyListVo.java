package cloud.xcan.angus.core.ai.interfaces.setting.facade.vo;

import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyPermission;
import cloud.xcan.angus.core.ai.domain.setting.apikey.ApiKeyStatus;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * API密钥列表VO
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "API密钥列表项")
public class ApiKeyListVo extends TenantAuditingVo {

  @Schema(description = "密钥ID")
  private Long id;

  @Schema(description = "密钥名称")
  private String name;

  @Schema(description = "密钥前缀（用于部分显示）sk-abc123")
  private String keyPrefix;

  @Schema(description = "部分可见密钥")
  private String keyVisible;

  @Schema(description = "状态")
  private ApiKeyStatus status;

  @Schema(description = "状态颜色")
  private String statusColor;

  @Schema(description = "权限列表")
  private List<ApiKeyPermission> permissions;

  @Schema(description = "授权资源列表")
  private List<ApiKeyDetailVo.AuthorizedResourceVo> authorizedResources;

  @Schema(description = "速率限制")
  private Integer rateLimit;

  @Schema(description = "每日限额")
  private Integer dailyLimit;

  @Schema(description = "使用次数")
  private Long usageCount;

  @Schema(description = "最后使用时间（格式化）")
  private LocalDateTime lastUsedAt;

  @Schema(description = "过期时间戳")
  private LocalDateTime expiresAt;

  @Schema(description = "撤销时间戳")
  private LocalDateTime revokedAt;

}
