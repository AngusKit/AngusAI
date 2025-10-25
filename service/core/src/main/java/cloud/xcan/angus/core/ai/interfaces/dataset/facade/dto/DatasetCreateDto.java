package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
import cloud.xcan.angus.core.ai.domain.dataset.Visibility;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Data
@Schema(description = "创建数据集请求参数")
public class DatasetCreateDto {

  @NotBlank(message = "数据集名称不能为空")
  @Length(max = 50)
  @Schema(description = "数据集名称", example = "用户行为数据", required = true)
  private String name;

  @NotBlank(message = "数据集描述不能为空")
  @Length(max = 500)
  @Schema(description = "数据集描述", example = "用户行为分析数据集", required = true)
  private String description;

  @Schema(description = "图标emoji", example = "📊")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-500")
  private String iconBg;

  @NotNull(message = "数据集类型不能为空")
  @Schema(description = "数据类型", required = true)
  private DatasetType type;

  @NotNull(message = "可见性不能为空")
  @Schema(description = "可见性", required = true)
  private Visibility visibility;

  @Size(max = 5, message = "标签最多5个")
  @Schema(description = "标签，最多5个")
  private List<String> tags;

  @Schema(description = "配置信息")
  private Object config;
}
