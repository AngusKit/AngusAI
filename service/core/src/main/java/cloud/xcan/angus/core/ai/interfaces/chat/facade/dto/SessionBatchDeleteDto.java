package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "批量删除会话请求")
public class SessionBatchDeleteDto {

  @Schema(description = "会话ID(UUID)列表", requiredMode = RequiredMode.REQUIRED)
  private List<String> sessionIds;
}
