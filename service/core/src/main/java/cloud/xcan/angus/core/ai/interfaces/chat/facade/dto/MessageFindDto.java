package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "查询消息请求")
public class MessageFindDto {

  @Schema(description = "页码", example = "1")
  private Integer pageNo = 1;

  @Schema(description = "每页大小", example = "20")
  private Integer pageSize = 20;

  @Schema(description = "获取指定消息之前的消息")
  private Long beforeId;

  @Schema(description = "获取指定消息之后的消息")
  private Long afterId;
}
