package cloud.xcan.angus.core.ai.interfaces.application.facade.vo;

import cloud.xcan.angus.core.ai.domain.application.ApplicationCategory;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.remote.NameJoinField;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Schema(description = "应用列表项")
public class ApplicationListVo {

  @Schema(description = "应用ID")
  private Long id;

  @Schema(description = "应用名称")
  private String name;

  @Schema(description = "应用图标")
  private String icon;

  @Schema(description = "应用描述")
  private String description;

  @Schema(description = "应用分类")
  private ApplicationCategory category;

  @Schema(description = "应用状态")
  private ApplicationStatus status;

  @Schema(description = "使用的模型")
  private String model;

  @Schema(description = "关联知识库数")
  private Integer knowledgeBaseCount;

  @Schema(description = "关联工作流数")
  private Integer workflowCount;

  @Schema(description = "是否公开访问")
  private Boolean publicAccess;

  @Schema(description = "是否启用嵌入")
  private Boolean embedEnabled;

  @Schema(description = "是否启用API")
  private Boolean apiEnabled;

  @Schema(description = "API调用次数")
  private Long apiCalls;

  @Schema(description = "租户ID")
  private Long tenantId;

  @Schema(description = "创建者ID")
  private Long createdBy;

  @Schema(description = "创建者姓名")
  @NameJoinField(id = "createdBy", repository = "commonUserBaseRepo")
  private String createdByName;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改人ID")
  protected Long lastModifiedBy;

  @NameJoinField(id = "lastModifiedBy", repository = "commonUserBaseRepo")
  private String lastModifiedByName;

  @Schema(description = "最后修改时间")
  private LocalDateTime lastModifiedDate;

  @Schema(description = "发布时间")
  private LocalDateTime publishedDate;
}
