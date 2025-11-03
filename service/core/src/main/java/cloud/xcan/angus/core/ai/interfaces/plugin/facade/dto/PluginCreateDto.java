package cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto;

import cloud.xcan.angus.core.ai.domain.plugin.PluginCategory;
import cloud.xcan.angus.core.ai.domain.plugin.PluginType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

@Data
@Schema(description = "创建插件请求参数")
public class PluginCreateDto {

  @NotBlank
  @Length(max = 100)
  @Schema(description = "插件名称", example = "天气查询插件", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @Schema(description = "插件图标", example = "🌤️")
  private String icon;

  @Length(max = 500)
  @Schema(description = "插件描述", example = "提供实时天气查询功能")
  private String description;

  @Length(max = 100)
  @Schema(description = "作者", example = "XCan")
  private String author;

  @NotBlank
  @Length(max = 20)
  @Schema(description = "版本号", example = "1.0.0", requiredMode = RequiredMode.REQUIRED)
  private String version;

  @NotNull(message = "插件分类不能为空")
  @Schema(description = "插件分类", requiredMode = RequiredMode.REQUIRED)
  private PluginCategory category;

  @NotNull(message = "插件类型不能为空")
  @Schema(description = "插件类型", requiredMode = RequiredMode.REQUIRED)
  private PluginType type;

  @Schema(description = "标签列表")
  private List<String> tags;

  @Schema(description = "是否公开", example = "false")
  private Boolean isPublic = false;

  @Length(max = 20)
  @Schema(description = "最小系统版本要求", example = "1.0.0")
  private String minVersion;

  @Length(max = 500)
  @Schema(description = "主页URL")
  private String homepageUrl;

  @Length(max = 500)
  @Schema(description = "文档URL")
  private String documentationUrl;

  @Length(max = 500)
  @Schema(description = "源码仓库URL")
  private String repositoryUrl;

  @Length(max = 500)
  @Schema(description = "支持URL")
  private String supportUrl;

  @Length(max = 50)
  @Schema(description = "许可证", example = "MIT")
  private String license;

  @NotNull
  @Schema(type = "string", format = "binary", description = "插件规范文件，最大支持200MB", requiredMode = RequiredMode.REQUIRED)
  private MultipartFile file;

  @Schema(description = "价格（0表示免费）", example = "0.0")
  private Double price = 0.0;

  @Length(max = 10)
  @Schema(description = "货币单位", example = "CNY")
  private String currency = "CNY";

}
