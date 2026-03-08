package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import static cloud.xcan.angus.core.ai.domain.Constants.DATASET_TAGS_MAX_COUNT;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.angus.core.ai.domain.Visibility;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新数据集请求参数")
public class DatasetUpdateDto {

  @Length(max = MAX_NAME_LENGTH)
  @Schema(description = "数据集名称", example = "用户行为数据")
  private String name;

  @Length(max = MAX_DESC_LENGTH_X4)
  @Schema(description = "数据集描述", example = "用户行为分析数据集")
  private String description;

  @Schema(description = "图标emoji", example = "📊")
  private String icon;

  @Schema(description = "背景色", example = "bg-blue-500")
  private String iconBg;

  @Schema(description = "可见性")
  private Visibility visibility;

  @Size(max = DATASET_TAGS_MAX_COUNT)
  @Schema(description = "标签，最多5个")
  private List<String> tags;
}
