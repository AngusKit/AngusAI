package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "最近应用列表响应")
public class RecentApplicationsVo {

  @Schema(description = "应用列表")
  private List<RecentApplicationItemVo> items;
}
