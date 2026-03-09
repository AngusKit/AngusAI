package cloud.xcan.angus.core.ai.interfaces.application.facade.vo;

import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "应用详情")
public class ApplicationDetailVo extends TenantAuditingVo {

  @Schema(description = "应用ID")
  private Long id;

  @Schema(description = "应用名称")
  private String name;

  @Schema(description = "应用图标")
  private String icon;

  @Schema(description = "应用描述")
  private String description;

  @Schema(description = "应用标签（最多5个）")
  private List<String> tags;

  @Schema(description = "应用状态")
  private ApplicationStatus status;

  @Schema(description = "发布时间")
  private LocalDateTime publishedDate;

  @Schema(description = "详细配置")
  private ApplicationConfigVo config;

  @Schema(description = "分享信息")
  private ApplicationShareVo share;

  @Schema(description = "统计数据")
  private ApplicationStatsVo stats;

  @Data
  @Schema(description = "应用配置（模型/资源/提示词由绑定的智能体提供）")
  public static class ApplicationConfigVo {

    @Schema(description = "绑定的智能体列表")
    private List<ResourceInfoVo> agents;

    @Schema(description = "默认智能体（用于对话）")
    private ResourceInfoVo defaultAgent;

    @Schema(description = "功能设置")
    private FeaturesConfigVo features;

    @Schema(description = "安全设置")
    private SecurityConfigVo security;

    @Schema(description = "发布设置")
    private PublishConfigVo publish;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Schema(description = "资源信息")
  public static class ResourceInfoVo {

    @Schema(description = "资源ID")
    private Long id;

    @Schema(description = "资源名称")
    private String name;
  }

  @Data
  @Schema(description = "功能设置")
  public static class FeaturesConfigVo {

    @Schema(description = "启用文件上传")
    private Boolean enableFileUpload;

    @Schema(description = "启用语音输入")
    private Boolean enableVoiceInput;

    @Schema(description = "启用图片输入")
    private Boolean enableImageInput;

    @Schema(description = "启用建议")
    private Boolean enableSuggestions;

    @Schema(description = "启用历史记录")
    private Boolean enableHistory;
  }

  @Data
  @Schema(description = "安全设置")
  public static class SecurityConfigVo {

    @Schema(description = "启用内容过滤")
    private Boolean enableContentFilter;

    @Schema(description = "启用数据加密")
    private Boolean enableDataEncryption;

    @Schema(description = "数据保留天数")
    private Integer dataRetentionDays;

    @Schema(description = "启用匿名化")
    private Boolean enableAnonymization;
  }

  @Data
  @Schema(description = "发布设置")
  public static class PublishConfigVo {

    @Schema(description = "公开访问")
    private Boolean publicAccess;

    @Schema(description = "启用嵌入")
    private Boolean embedEnabled;

    @Schema(description = "启用API")
    private Boolean apiEnabled;
  }

  @Data
  @Schema(description = "应用统计")
  public static class ApplicationStatsVo {

    @Schema(description = "总API调用次数")
    private Long totalApiCalls;

    @Schema(description = "总token数")
    private Long totalTokens;

    @Schema(description = "平均响应时间")
    private Double avgResponseTime;

    @Schema(description = "成功率")
    private Double successRate;
  }

  @Data
  @Schema(description = "分享信息")
  public static class ApplicationShareVo {

    // 全部设置成false时，只允许自己访问

    @Schema(description = "公开访问：允许任何人通过链接访问应用")
    private boolean publicAccess = true;

    @Schema(description = "匿名访问：允许未登录用户访问应用")
    private boolean anonymousAccess = false;

    @Schema(description = "授权访问：只有授权用户才可访问")
    private boolean authorizationRequired = true;

    @Schema(description = "分享ID")
    private String shareId;

    @Schema(description = "分享链接")
    private String shareUrl;

    @Schema(description = "邀请码")
    private String inviteCode;

    @Schema(description = "二维码图片URL")
    private String qrCode;

    @Schema(description = "过期时间")
    private LocalDateTime expiresAt;
  }
}
