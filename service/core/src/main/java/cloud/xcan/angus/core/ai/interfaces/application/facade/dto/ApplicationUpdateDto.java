package cloud.xcan.angus.core.ai.interfaces.application.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH_X4;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.angus.core.ai.domain.application.ApplicationCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新应用基本信息请求参数")
public class ApplicationUpdateDto {

  @Length(max = MAX_NAME_LENGTH)
  @Schema(description = "应用名称", example = "我的智能助手")
  private String name;

  @Schema(description = "应用图标（emoji或URL）", example = "🤖")
  private String icon;

  @Length(max = MAX_DESC_LENGTH_X4)
  @Schema(description = "应用描述", example = "这是一个智能助手应用")
  private String description;

  @Schema(description = "应用分类")
  private ApplicationCategory category;

  @Schema(description = "绑定的智能体ID列表")
  private List<Long> agentIds;

  @Schema(description = "默认智能体ID（用于对话，不传则取 agentIds 第一个）")
  private Long defaultAgentId;
}
