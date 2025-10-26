package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyPermission;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ApiKeyStatus;
import cloud.xcan.angus.core.ai.domain.settings.apikey.ResourceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * API密钥详情VO
 */
@Data
@Schema(description = "API密钥详情")
public class ApiKeyDetailVo {

  @Schema(description = "密钥ID")
  private Long id;

  @Schema(description = "密钥名称")
  private String name;

  @Schema(description = "密钥描述")
  private String description;

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
  private String rateLimit;

  @Schema(description = "速率限制原始值")
  private Integer rateLimitRaw;

  @Schema(description = "每日限额")
  private Integer dailyLimit;

  @Schema(description = "IP白名单")
  private List<String> ipWhitelist;

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

  @Schema(description = "撤销时间戳")
  private Long revokedAt;

  @Schema(description = "撤销原因")
  private String revokeReason;

  @Schema(description = "警告信息")
  private String warning;

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
