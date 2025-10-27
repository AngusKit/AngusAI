package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "表数据预览响应")
public class DatasourceTableDataPreviewVo {

  @Schema(description = "是否成功")
  private boolean success;

  @Schema(description = "消息")
  private String message;

  @Schema(description = "详细信息")
  private String details;

  @Schema(description = "列名列表")
  private List<String> columns;

  @Schema(description = "数据行列表")
  private List<Map<String, Object>> data;

  @Schema(description = "总记录数")
  private long total;

}
