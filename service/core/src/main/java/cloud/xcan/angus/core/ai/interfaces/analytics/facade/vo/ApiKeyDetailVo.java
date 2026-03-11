package cloud.xcan.angus.core.ai.interfaces.analytics.facade.vo;

import cloud.xcan.angus.core.ai.domain.ResourceType;
import cloud.xcan.angus.core.ai.domain.apikey.ApiKeyPermission;
import cloud.xcan.angus.core.ai.domain.apikey.ApiKeyStatus;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * API密钥详情VO
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "API密钥详情")
public class ApiKeyDetailVo extends TenantAuditingVo {

  @Schema(description = "密钥ID")
  private Long id;

  @Schema(description = "密钥名称")
  private String name;

  @Schema(description = "密钥前缀（用于部分显示）sk-abc123")
  private String keyPrefix;

  @Schema(description = "完整密钥（仅创建时返回）")
  private String key;

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
  private Integer rateLimit;

  @Schema(description = "每日限额")
  private Integer dailyLimit;

  @Schema(description = "IP白名单")
  private List<String> ipWhitelist;

  @Schema(description = "使用次数")
  private Long usageCount;

  @Schema(description = "最后使用时间（格式化）")
  private LocalDateTime lastUsedAt;

  @Schema(description = "过期时间戳")
  private LocalDateTime expiresAt;

  @Schema(description = "撤销时间戳")
  private LocalDateTime revokedAt;

  @Schema(description = "撤销原因")
  private String revokeReason;

  @Schema(description = "警告信息")
  private String warning;

  @Schema(description = "使用统计")
  private UsageStatsVo usageStats;

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

  /**
   * 使用统计VO
   */
  @Data
  @Schema(description = "使用统计")
  public static class UsageStatsVo {

    @Schema(description = "总计")
    private Long total;

    @Schema(description = "今日")
    private Long today;

    @Schema(description = "本周")
    private Long thisWeek;

    @Schema(description = "本月")
    private Long thisMonth;
  }
}
