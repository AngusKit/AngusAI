package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "批量删除数据数据集数据参数")
public class DatasetDataBatchDeleteDto {

  @Schema(description = "数据名称（文件名或表名）")
  private List<String> names;

}
