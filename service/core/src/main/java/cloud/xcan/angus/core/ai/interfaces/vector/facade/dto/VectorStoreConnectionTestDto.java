package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "连接测试请求参数")
public class VectorStoreConnectionTestDto {

  @Min(1)
  @Schema(description = "超时时间（秒）", example = "30")
  private Integer timeout = 30;

  @Schema(description = "向量存储配置")
  private VectorStoreConfigDefinition config;

}

