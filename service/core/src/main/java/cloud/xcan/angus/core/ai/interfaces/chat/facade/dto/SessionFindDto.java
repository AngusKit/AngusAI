package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import cloud.xcan.angus.remote.PageQuery;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "查询会话请求")
public class SessionFindDto extends PageQuery {

  @Schema(description = "会话标题")
  private String title;

  @Schema(description = "筛选指定应用")
  private Long appId;

  @Schema(description = "筛选使用的智能体")
  private Long agentId;

  @Schema(description = "筛选使用的模型")
  private Long modelId;

  @Schema(description = "是否已归档")
  private Boolean isArchived;

  @Schema(description = "是否已收藏（星标）")
  private Boolean isStarred;

  @Schema(description = "是否已置顶")
  private Boolean isPinned;
}
