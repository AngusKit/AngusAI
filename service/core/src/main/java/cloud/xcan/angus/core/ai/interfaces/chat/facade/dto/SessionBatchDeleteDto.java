package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

/**
 * 批量删除DTO
 */
@Data
@Schema(description = "批量删除会话请求")
public class SessionBatchDeleteDto {

  @Schema(description = "会话ID列表", required = true)
  private List<Long> sessionIds;
}
