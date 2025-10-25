package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
@Schema(description = "批量删除数据请求参数")
public class BatchDeleteDto {

  @Schema(description = "记录ID列表")
  private List<Long> recordIds;

  @Schema(description = "过滤条件")
  private Object filter;
}
