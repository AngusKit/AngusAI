package cloud.xcan.angus.core.ai.domain.application;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "应用配置更新请求参数（强制绑定智能体，模型/资源/提示词由 Agent 提供）")
public class ApplicationConfig {

  @NotNull
  @Size(min = 1, max = 20)
  @Schema(description = "绑定的智能体ID列表（至少一个）", requiredMode = RequiredMode.REQUIRED)
  private List<Long> agentIds;

  @Schema(description = "默认智能体ID（用于对话，不传则取 agentIds 第一个）")
  private Long defaultAgentId;

  @Schema(description = "功能设置")
  private FeaturesConfig features = new FeaturesConfig();

  @Schema(description = "安全设置")
  private SecurityConfig security = new SecurityConfig();

  @Schema(description = "发布设置")
  private PublishConfig publish = new PublishConfig();

  @Data
  @Schema(description = "功能设置")
  public static class FeaturesConfig {

    @Schema(description = "启用文件上传")
    private Boolean enableFileUpload = false;

    @Schema(description = "启用语音输入")
    private Boolean enableVoiceInput = false;

    @Schema(description = "启用图片输入")
    private Boolean enableImageInput = false;

    @Schema(description = "启用历史记录")
    private Boolean enableHistory;

    @Schema(description = "启用提示词库：开启后用户可以在对话页面选择提示词")
    private Boolean enablePromptLibrary = false;

    @Schema(description = "启用会话列表：开启后在对话页面查看对话记录")
    private Boolean enableSessionList = true;

    @Schema(description = "启用切换应用：开启后允许切换应用、默认智能体、默认模型，关闭时隐藏应用切换")
    private Boolean enableSwitchApp = true;
  }

  @Data
  @Schema(description = "安全设置")
  public static class SecurityConfig {

    @Schema(description = "启用内容过滤")
    private Boolean enableContentFilter = false;

    @Schema(description = "启用数据加密")
    private Boolean enableDataEncryption = false;

    @Min(value = 1, message = "数据保留天数不能小于1")
    @Schema(description = "数据保留天数", example = "30")
    private Integer dataRetentionDays;

    @Schema(description = "启用匿名化")
    private Boolean enableAnonymization = false;
  }

  @Data
  @Schema(description = "发布设置")
  public static class PublishConfig {

    @Schema(description = "公开访问")
    private Boolean publicAccess = false;

    @Schema(description = "启用嵌入")
    private Boolean embedEnabled = false;

    @Schema(description = "启用API")
    private Boolean apiEnabled = false;
  }

}
