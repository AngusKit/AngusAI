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
@Schema(description = "应用配置更新请求参数（强制绑定智能体，模型/资源/提示词由 Agent 提供）")
public class ApplicationConfig {

  @NotNull
  @Schema(description = "绑定的智能体ID", requiredMode = RequiredMode.REQUIRED)
  private Long agentId;

  @Schema(description = "对话设置")
  private ConversationConfig conversation;

  @Schema(description = "功能设置")
  private FeaturesConfig features;

  @Schema(description = "安全设置")
  private SecurityConfig security;

  @Schema(description = "发布设置")
  private PublishConfig publish;

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
