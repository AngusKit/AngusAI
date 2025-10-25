package cloud.xcan.angus.core.ai.interfaces.prompt.facade.vo;

import cloud.xcan.angus.core.ai.domain.prompt.PromptStatus;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "提示词详情")
public class PromptDetailVo {

  @Schema(description = "ID")
  private Long id;

  @Schema(description = "标题")
  private String title;

  @Schema(description = "内容")
  private String content;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "分类ID")
  private Long categoryId;

  @Schema(description = "分类名称")
  private String categoryName;

  @Schema(description = "标签")
  private JsonNode tags;

  @Schema(description = "是否收藏")
  private Boolean isFavorite;

  @Schema(description = "使用次数")
  private Long usageCount;

  @Schema(description = "是否为系统模板")
  private Boolean isSystem;

  @Schema(description = "是否公开")
  private Boolean isPublic;

  @Schema(description = "变量定义")
  private JsonNode variables;

  @Schema(description = "使用示例")
  private JsonNode examples;

  @Schema(description = "状态")
  private PromptStatus status;

  @Schema(description = "创建时间")
  private Long createdDate;

  @Schema(description = "最后修改时间")
  private Long lastModifiedDate;

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "创建者名称")
  private String createdByName;

  @Schema(description = "统计信息")
  private PromptStatsVo stats;

}
