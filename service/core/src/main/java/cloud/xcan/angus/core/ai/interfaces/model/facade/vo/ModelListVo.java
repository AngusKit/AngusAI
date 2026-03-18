package cloud.xcan.angus.core.ai.interfaces.model.facade.vo;

import cloud.xcan.agentx.core.model.ModelProvider;
import cloud.xcan.angus.core.ai.domain.model.ModelPerformance;
import cloud.xcan.angus.core.ai.domain.model.ModelStats;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import dev.langchain4j.model.catalog.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "模型列表项响应")
public class ModelListVo extends TenantAuditingVo {

  @Schema(description = "模型ID")
  private Long id;

  @Schema(description = "模型名称")
  private String name;

  @Schema(description = "模型描述")
  private String description;

  @Schema(description = "模型类型")
  private ModelType type;

  @Schema(description = "模型提供商")
  private ModelProvider provider;

  @Schema(description = "模型状态")
  private ModelStatus status;

  @Schema(description = "统计数据（今日调用、成本等，用于列表卡片展示）")
  private ModelStats stats;

  @Schema(description = "性能指标（延迟等）")
  private ModelPerformance performance;

  @Schema(description = "最大Token数")
  private Integer maxTokens;

}
