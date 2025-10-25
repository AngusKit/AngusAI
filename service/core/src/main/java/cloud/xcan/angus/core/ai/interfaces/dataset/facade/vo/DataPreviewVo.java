package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "数据预览响应")
public class DataPreviewVo {

  @Schema(description = "文本数据")
  private Object textData;

  @Schema(description = "表格数据")
  private Object tableData;

  @Schema(description = "数据源数据")
  private Object dataSourceData;

  @Schema(description = "分页信息")
  private Object pagination;
}
