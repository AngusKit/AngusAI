package cloud.xcan.angus.core.ai.interfaces.application.facade.vo;

import cloud.xcan.angus.core.ai.domain.application.ApplicationCategory;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.remote.NameJoinField;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "应用详情")
public class ApplicationDetailVo {

  @Schema(description = "应用ID")
  private Long id;

  @Schema(description = "应用名称")
  private String name;

  @Schema(description = "应用图标")
  private String icon;

  @Schema(description = "应用描述")
  private String description;

  @Schema(description = "应用分类")
  private ApplicationCategory category;

  @Schema(description = "应用状态")
  private ApplicationStatus status;

  @Schema(description = "默认语言")
  private String language;

  @Schema(description = "租户ID")
  private Long tenantId;

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "创建者姓名")
  @NameJoinField(id = "createdBy", repository = "commonUserBaseRepo")
  private String createdByName;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改人ID")
  protected Long lastModifiedBy;

  @NameJoinField(id = "lastModifiedBy", repository = "commonUserBaseRepo")
  private String lastModifiedByName;

  @Schema(description = "最后修改时间")
  private LocalDateTime lastModifiedDate;

  @Schema(description = "发布时间")
  private LocalDateTime publishedDate;

  @Schema(description = "详细配置")
  private ApplicationConfigVo config;

  @Schema(description = "分享信息")
  private ApplicationShareVo share;

  @Schema(description = "统计数据")
  private ApplicationStatsVo stats;

  @Data
  @Schema(description = "应用配置")
  public static class ApplicationConfigVo {

    @Schema(description = "模型配置")
    private ModelConfigVo model;

    @Schema(description = "关联资源")
    private ResourcesConfigVo resources;

    @Schema(description = "提示词配置")
    private PromptsConfigVo prompts;

    @Schema(description = "对话设置")
    private ConversationConfigVo conversation;

    @Schema(description = "功能设置")
    private FeaturesConfigVo features;

    @Schema(description = "安全设置")
    private SecurityConfigVo security;

    @Schema(description = "发布设置")
    private PublishConfigVo publish;
  }

  @Data
  @Schema(description = "模型配置")
  public static class ModelConfigVo {

    @Schema(description = "模型提供商")
    private String provider;

    @Schema(description = "模型名称")
    private String modelName;

    @Schema(description = "温度")
    private Double temperature;

    @Schema(description = "最大token数")
    private Integer maxTokens;

    @Schema(description = "top_p")
    private Double topP;

    @Schema(description = "频率惩罚")
    private Double frequencyPenalty;

    @Schema(description = "存在惩罚")
    private Double presencePenalty;
  }

  @Data
  @Schema(description = "关联资源配置")
  public static class ResourcesConfigVo {

    @Schema(description = "关联的知识库ID")
    private Long knowledgeBaseId;
    @Schema(description = "关联的知识库名称")
    @NameJoinField(id = "knowledgeBaseId", repository = "knowledgeBaseRepo")
    private String knowledgeBaseName;

    @Schema(description = "关联的数据集ID")
    private Long datasetId;
    @Schema(description = "关联的数据集名称")
    @NameJoinField(id = "datasetId", repository = "datasetRepo")
    private String datasetName;

    @Schema(description = "关联的工作流ID")
    private Long workflowId;
    @Schema(description = "关联的工作流名称")
    @NameJoinField(id = "workflowId", repository = "workflowRepo")
    private String workflowName;
  }

  @Data
  @Schema(description = "资源信息")
  public static class ResourceInfoVo {

    @Schema(description = "资源ID")
    private Long id;

    @Schema(description = "资源名称")
    private String name;
  }

  @Data
  @Schema(description = "工作流信息")
  public static class WorkflowInfoVo {

    @Schema(description = "工作流ID")
    private Long id;

    @Schema(description = "工作流名称")
    private String name;

    @Schema(description = "是否启用")
    private Boolean enabled;
  }

  @Data
  @Schema(description = "提示词配置")
  public static class PromptsConfigVo {

    @Schema(description = "系统提示词")
    private String system;

    @Schema(description = "上下文提示词")
    private String context;
  }

  @Data
  @Schema(description = "对话设置")
  public static class ConversationConfigVo {

    @Schema(description = "欢迎消息")
    private String welcomeMessage;

    @Schema(description = "开场问题列表")
    private List<String> openingQuestions;

    @Schema(description = "最大历史长度")
    private Integer maxHistoryLength;
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
