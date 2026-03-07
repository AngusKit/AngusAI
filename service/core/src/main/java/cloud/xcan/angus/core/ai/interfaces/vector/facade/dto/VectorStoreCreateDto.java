package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_DESC_LENGTH;
import static cloud.xcan.angus.spec.experimental.BizConstant.MAX_NAME_LENGTH;

import cloud.xcan.agentx.core.vectorstore.VectorStoreConfigDefinition;
import cloud.xcan.agentx.core.vectorstore.VectorStoreType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建向量存储源请求参数")
public class VectorStoreCreateDto {

  @NotBlank
  @Length(max = MAX_NAME_LENGTH)
  @Schema(description = "存储源名称", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotNull
  @Schema(description = "数据库类型", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreType type;

  @Length(max = MAX_DESC_LENGTH)
  @Schema(description = "描述")
  private String description;

  @NotNull
  @Valid
  @Schema(description = "配置信息", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreConfigDefinition config;

}
