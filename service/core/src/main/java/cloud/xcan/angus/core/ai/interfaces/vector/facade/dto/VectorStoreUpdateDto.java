package cloud.xcan.angus.core.ai.interfaces.vector.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Map;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "更新向量存储源请求参数")
public class VectorStoreUpdateDto {

  @Length(max = 100)
  @Schema(description = "存储源名称")
  private String name;

  @Length(max = 500)
  @Schema(description = "描述")
  private String description;

  @Length(max = 500)
  @Schema(description = "连接地址")
  private String endpoint;

  @Min(1)
  @Max(4096)
  @Schema(description = "向量维度", example = "1536")
  private Integer dimension;

  @Schema(description = "配置信息")
  private Map<String, String> config;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "是否自动同步")
  private Boolean autoSync;

  @Schema(description = "同步间隔（分钟）")
  private Integer syncInterval;
}

