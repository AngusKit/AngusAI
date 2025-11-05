package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "创建向量存储源请求参数")
public class VectorStoreCreateDto {

  @NotBlank
  @Length(max = 100)
  @Schema(description = "存储源名称", required = true)
  private String name;

  @NotNull
  @Schema(description = "数据库类型", required = true)
  private VectorStoreType type;

  @Length(max = 500)
  @Schema(description = "描述")
  private String description;

  @NotBlank
  @Length(max = 500)
  @Schema(description = "连接地址", required = true)
  private String endpoint;

  @NotNull
  @Min(1)
  @Max(4096)
  @Schema(description = "向量维度", required = true, example = "1536")
  private Integer dimension;

  @NotNull
  @Schema(description = "配置信息", required = true)
  private Map<String, String> config;

  @Schema(description = "是否启用", example = "true")
  private Boolean enabled = true;

  @Schema(description = "是否自动同步", example = "false")
  private Boolean autoSync = false;

  @Schema(description = "同步间隔（分钟）", example = "60")
  private Integer syncInterval = 60;
}

