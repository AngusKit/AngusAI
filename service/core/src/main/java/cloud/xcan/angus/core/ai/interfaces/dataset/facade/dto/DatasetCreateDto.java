package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import static cloud.xcan.angus.core.ai.domain.Constants.DATASET_TAGS_MAX_COUNT;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.dataset.DatasetType;
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
  @Length(max = MAX_NAME_LENGTH)
  @Schema(description = "数据集名称", example = "用户行为数据", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotBlank
  @Length(max = MAX_DESC_LENGTH_X4)
  @Schema(description = "数据集描述", example = "用户行为分析数据集", requiredMode = RequiredMode.REQUIRED)
  private String description;

  @NotNull
  @Schema(description = "数据类型", requiredMode = RequiredMode.REQUIRED)
  private DatasetType type;

  @NotNull
  @Schema(description = "可见性", requiredMode = RequiredMode.REQUIRED)
  private Visibility visibility;

  @Schema(description = "图标emoji", example = "📊")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-500")
  private String iconBg;

  @Size(max = DATASET_TAGS_MAX_COUNT)
  @Schema(description = "标签，最多5个")
  private List<String> tags;
}
