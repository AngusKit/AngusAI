package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetVisibility;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建数据集请求参数")
public class DatasetCreateDto {

  @NotBlank
  @Length(max = 50)
  @Schema(description = "数据集名称", example = "用户行为数据", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Length(max = 400)
  @Schema(description = "数据集描述", example = "用户行为分析数据集", requiredMode = RequiredMode.REQUIRED)
  private String description;

  @NotNull
  @Schema(description = "数据类型", requiredMode = RequiredMode.REQUIRED)
  private DatasetType type;

  @NotNull
  @Schema(description = "可见性", requiredMode = RequiredMode.REQUIRED)
  private DatasetVisibility visibility;

  @Schema(description = "图标emoji", example = "📊")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-500")
  private String iconBg;

  @Size(max = 5)
  @Schema(description = "标签，最多5个")
  private List<String> tags;
}
