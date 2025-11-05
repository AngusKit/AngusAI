package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import cloud.xcan.angus.core.ai.domain.vector.VectorStoreConfig;
import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
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
  @Length(max = 100)
  @Schema(description = "存储源名称", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotNull
  @Schema(description = "数据库类型", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreType type;

  @Length(max = 500)
  @Schema(description = "描述")
  private String description;

  @NotNull
  @Valid
  @Schema(description = "配置信息", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreConfig config;

}
