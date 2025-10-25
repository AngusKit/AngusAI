package cloud.xcan.angus.core.ai.interfaces.settings.facade.vo;

import cloud.xcan.angus.core.ai.domain.settings.TwoFactorMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

/**
 * 安全设置详情
 */
@Data
@Schema(description = "安全设置详情")
public class SecuritySettingsVo {

  @Schema(description = "双因素认证")
  private TwoFactorVo twoFactor;

  @Schema(description = "会话管理")
  private SessionsVo sessions;

  @Schema(description = "登录历史")
  private List<LoginHistoryItemVo> loginHistory;

  @Schema(description = "密码策略")
  private PasswordPolicyVo passwordPolicy;

  @Schema(description = "IP白名单")
  private IpWhitelistVo ipWhitelist;

  @Data
  @Schema(description = "双因素认证")
  public static class TwoFactorVo {

    @Schema(description = "是否启用")
    private Boolean enabled;

    @Schema(description = "认证方法")
    private TwoFactorMethod method;

    @Schema(description = "设置时间")
    private LocalDateTime setupAt;
  }

  @Data
  @Schema(description = "会话管理")
  public static class SessionsVo {

    @Schema(description = "最大活跃会话数")
    private Integer maxActiveSessions;

    @Schema(description = "当前会话数")
    private Integer currentSessions;

    @Schema(description = "会话超时时间（分钟）")
    private Integer sessionTimeout;

    @Schema(description = "活跃会话列表")
    private List<ActiveSessionVo> activeSessions;
  }

  @Data
  @Schema(description = "活跃会话")
  public static class ActiveSessionVo {

    @Schema(description = "会话ID")
    private String id;

    @Schema(description = "设备")
    private String device;

    @Schema(description = "浏览器")
    private String browser;

    @Schema(description = "IP地址")
    private String ip;

    @Schema(description = "位置")
    private String location;

    @Schema(description = "是否当前会话")
    private Boolean current;

    @Schema(description = "最后活跃时间")
    private LocalDateTime lastActiveAt;

    @Schema(description = "创建时间")
    private LocalDateTime createdDate;
  }

  @Data
  @Schema(description = "登录历史项")
  public static class LoginHistoryItemVo {

    @Schema(description = "ID")
    private Long id;

    @Schema(description = "登录时间")
    private LocalDateTime datetime;

    @Schema(description = "IP地址")
    private String ip;

    @Schema(description = "位置")
    private String location;

    @Schema(description = "设备")
    private String device;

    @Schema(description = "浏览器")
    private String browser;

    @Schema(description = "状态")
    private String status;
  }

  @Data
  @Schema(description = "密码策略")
  public static class PasswordPolicyVo {

    @Schema(description = "最小长度")
    private Integer minLength;

    @Schema(description = "要求大写字母")
    private Boolean requireUppercase;

    @Schema(description = "要求小写字母")
    private Boolean requireLowercase;

    @Schema(description = "要求数字")
    private Boolean requireNumbers;

    @Schema(description = "要求特殊字符")
    private Boolean requireSpecialChars;

    @Schema(description = "最后修改时间")
    private LocalDateTime lastChangedAt;

    @Schema(description = "过期天数")
    private Integer expiresIn;
  }

  @Data
  @Schema(description = "IP白名单")
  public static class IpWhitelistVo {

    @Schema(description = "是否启用")
    private Boolean enabled;

    @Schema(description = "IP地址列表")
    private List<String> addresses;
  }
}
