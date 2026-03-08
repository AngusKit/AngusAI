package cloud.xcan.angus.core.ai.interfaces.vector.facade.vo;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import cloud.xcan.angus.core.ai.domain.ConnectionStatus;
import cloud.xcan.angus.remote.vo.TenantAuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Schema(description = "向量存储源详情")
public class VectorStoreVo extends TenantAuditingVo {

  @Schema(description = "存储源ID")
  private Long id;

  @Schema(description = "名称")
  private String name;

  @Schema(description = "数据库类型")
  private VectorStoreType type;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "状态")
  private ConnectionStatus status;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "索引数量")
  private Long indexCount;

  @Schema(description = "配置信息")
  private VectorStoreConfigDefinition config;

}

