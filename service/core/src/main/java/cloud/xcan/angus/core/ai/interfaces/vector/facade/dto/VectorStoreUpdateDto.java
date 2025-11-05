package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import cloud.xcan.angus.core.ai.domain.vector.VectorStoreConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新向量存储源请求参数")
public class VectorStoreUpdateDto {

  @NotBlank
  @Length(max = 100)
  @Schema(description = "存储源名称", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @Length(max = 500)
  @Schema(description = "描述")
  private String description;

  @NotNull
  @Valid
  @Schema(description = "配置信息", requiredMode = RequiredMode.REQUIRED)
  private VectorStoreConfig config;

}

