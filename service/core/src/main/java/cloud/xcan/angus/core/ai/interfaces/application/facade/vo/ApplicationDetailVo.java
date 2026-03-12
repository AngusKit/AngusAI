package cloud.xcan.angus.core.ai.interfaces.application.facade.vo;

import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.domain.agent.AgentStatus;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import cloud.xcan.agentx.core.agent.enums.InteractionMode;
import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelProvider;
import dev.langchain4j.model.catalog.ModelType;
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

  @Schema(description = "绑定的智能体列表")
  private List<AgentInfoVo> agents;

  @Schema(description = "默认智能体（用于对话）")
  private AgentInfoVo defaultAgent;

  @Data
  @Schema(description = "应用配置（模型/资源/提示词由绑定的智能体提供）")
  public static class ApplicationConfigVo {

    @Schema(description = "绑定的智能体列表")
    private List<AgentInfoVo> agents;

    @Schema(description = "默认智能体（用于对话）")
    private AgentInfoVo defaultAgent;

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
  @NoArgsConstructor
  @AllArgsConstructor
  @Schema(description = "智能体信息")
  public static class AgentInfoVo {

    @Schema(description = "智能体ID")
    private Long id;

    @Schema(description = "名称")
    private String name;

    @Schema(description = "描述")
    private String description;

    @Schema(description = "状态")
    private AgentStatus status;

    @Schema(description = "交互模式")
    private InteractionMode interactionMode;

    @Schema(description = "默认模型（含ID和名称）")
    private ModelInfoVo defaultModel;

    @Schema(description = "欢迎消息")
    private String welcomeMessage;

    @Schema(description = "建议问题列表")
    private List<String> suggestedQuestions;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Schema(description = "模型信息")
  public static class ModelInfoVo {

    @Schema(description = "模型ID")
    private Long id;

    @Schema(description = "模型名称")
    private String name;

    @Schema(description = "模型描述")
    private String description;

    @Schema(description = "模型类型")
    private ModelType type;

    @Schema(description = "模型提供商")
    private ModelProvider provider;

    @Schema(description = "模型状态")
    private ModelStatus status;

    @Schema(description = "配置信息")
    private ModelConfigDefinition config;
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

    @Schema(description = "启用历史记录")
    private Boolean enableHistory;

    @Schema(description = "启用提示词库：开启后用户可以在对话页面选择提示词")
    private Boolean enablePromptLibrary;

    @Schema(description = "启用会话列表：开启后在对话页面查看对话记录")
    private Boolean enableSessionList;

    @Schema(description = "启用切换应用：开启后允许切换应用、默认智能体、默认模型，关闭时隐藏应用切换")
    private Boolean enableSwitchApp;
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
