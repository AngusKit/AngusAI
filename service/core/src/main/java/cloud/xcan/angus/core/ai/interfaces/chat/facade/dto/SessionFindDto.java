package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 查询会话DTO
 */
@Data
@Schema(description = "查询会话请求")
public class SessionFindDto {

  @Schema(description = "页码", example = "1")
  private Integer pageNo = 1;

  @Schema(description = "每页大小", example = "20")
  private Integer pageSize = 20;

  @Schema(description = "筛选指定应用")
  private Long appId;

  @Schema(description = "筛选使用的模型")
  private Long modelId;

  @Schema(description = "排序字段", example = "createdDate")
  private String orderBy = "lastModifiedDate";

  @Schema(description = "排序方式", example = "desc")
  private String orderSort = "desc";

  @Schema(description = "是否已归档")
  private Boolean isArchived;

  @Schema(description = "是否已收藏（星标）")
  private Boolean isStarred;

  @Schema(description = "是否已置顶")
  private Boolean isPinned;
}
