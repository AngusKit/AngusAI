package cloud.xcan.angus.core.ai.interfaces.application.facade.vo;

import cloud.xcan.angus.core.ai.domain.application.ApplicationCategory;
import cloud.xcan.angus.core.ai.domain.application.ApplicationStatus;
import cloud.xcan.angus.core.ai.interfaces.application.facade.vo.ApplicationDetailVo.ResourceInfoVo;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "应用列表项")
public class ApplicationListVo extends TenantAuditingVo {

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

  @Schema(description = "绑定的智能体列表")
  private List<ResourceInfoVo> agents;

  @Schema(description = "默认智能体（用于对话）")
  private ResourceInfoVo defaultAgent;

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

  @Schema(description = "发布时间")
  private LocalDateTime publishedDate;

}
