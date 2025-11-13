package cloud.xcan.angus.core.ai.domain.application;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "应用配置更新请求参数")
public class ApplicationConfig {

  @Valid
  @NotNull
  @Schema(description = "模型配置", requiredMode = RequiredMode.REQUIRED)
  private ModelConfig model;

  @Valid
  @Schema(description = "关联资源")
  private ResourcesConfig resources;

  @Valid
  @NotNull
  @Schema(description = "提示词配置", requiredMode = RequiredMode.REQUIRED)
  private PromptsConfig prompts;

  @Schema(description = "对话设置")
  private ConversationConfig conversation;

  @Schema(description = "功能设置")
  private FeaturesConfig features;

  @Schema(description = "安全设置")
  private SecurityConfig security;

  @Schema(description = "发布设置")
  private PublishConfig publish;

  @Data
  @Schema(description = "默认模型配置")
  public static class ModelConfig {

    @Schema(description = "模型Id", requiredMode = RequiredMode.REQUIRED)
    @NotNull
    private Long id;

    @Schema(description = "模型提供商", example = "openai")
    private String provider;

    @Schema(description = "模型名称", example = "gpt-3.5-turbo")
    private String modelName;

    @Min(value = 0, message = "温度值不能小于0")
    @Max(value = 2, message = "温度值不能大于2")
    @Schema(description = "温度", example = "0.5")
    private Double temperature;

    @Min(value = 1, message = "最大token数不能小于1")
    @Schema(description = "最大token数", example = "2048")
    private Integer maxTokens;

    @Min(value = 0, message = "top_p值不能小于0")
    @Max(value = 1, message = "top_p值不能大于1")
    @Schema(description = "top_p", example = "0.9")
    private Double topP;

    @Min(value = -2, message = "频率惩罚不能小于-2")
    @Max(value = 2, message = "频率惩罚不能大于2")
    @Schema(description = "频率惩罚", example = "0.0")
    private Double frequencyPenalty;

    @Min(value = -2, message = "存在惩罚不能小于-2")
    @Max(value = 2, message = "存在惩罚不能大于2")
    @Schema(description = "存在惩罚", example = "0.0")
    private Double presencePenalty;
  }

  @Data
  @Schema(description = "关联资源配置")
  public static class ResourcesConfig {

    @Size(max = 5)
    @Schema(description = "关联的知识库ID，最多5个")
    private List<Long> knowledgeBaseIds;

    @Size(max = 5)
    @Schema(description = "关联的数据集ID列表，最多5个")
    private List<Long> datasetIds;

    @Size(max = 10)
    @Schema(description = "关联的接口集ID列表，最多10个")
    private List<Long> apiCollectionIds;

    @Schema(description = "关联的工作流ID")
    private Long workflowId;
  }

  @Data
  @Schema(description = "提示词配置")
  public static class PromptsConfig {

    @Schema(description = "系统提示词")
    private String system;

    @Schema(description = "上下文提示词")
    private String context;
  }

  @Data
  @Schema(description = "对话设置")
  public static class ConversationConfig {

    @Schema(description = "欢迎消息")
    private String welcomeMessage;

    @Schema(description = "开场问题列表")
    private List<String> openingQuestions;

    @Min(value = 1, message = "最大历史长度不能小于1")
    @Schema(description = "最大历史长度", example = "10")
    private Integer maxHistoryLength;
  }

  @Data
  @Schema(description = "功能设置")
  public static class FeaturesConfig {

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
  public static class SecurityConfig {

    @Schema(description = "启用内容过滤")
    private Boolean enableContentFilter;

    @Schema(description = "启用数据加密")
    private Boolean enableDataEncryption;

    @Min(value = 1, message = "数据保留天数不能小于1")
    @Schema(description = "数据保留天数", example = "30")
    private Integer dataRetentionDays;

    @Schema(description = "启用匿名化")
    private Boolean enableAnonymization;
  }

  @Data
  @Schema(description = "发布设置")
  public static class PublishConfig {

    @Schema(description = "公开访问")
    private Boolean publicAccess;

    @Schema(description = "启用嵌入")
    private Boolean embedEnabled;

    @Schema(description = "启用API")
    private Boolean apiEnabled;
  }

  public void checkValid(){
    // TODO
  }
}
