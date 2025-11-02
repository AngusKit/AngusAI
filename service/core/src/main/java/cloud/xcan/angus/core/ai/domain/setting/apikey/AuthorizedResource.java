package cloud.xcan.angus.core.ai.domain.setting.apikey;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "授权资源")
public class AuthorizedResource {

  @Schema(description = "资源类型", example = "APPLICATION")
  private ResourceType type;

  @Schema(description = "资源ID列表（空数组表示全部）", example = "[]")
  private List<Long> ids;
}
