package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "添加数据源请求参数")
public class DataSourceCreateDto {

  @NotBlank(message = "数据源名称不能为空")
  @Length(max = 50)
  @Schema(description = "数据源名称", example = "MySQL数据库", required = true)
  private String name;

  @NotBlank(message = "数据源类型不能为空")
  @Schema(description = "数据源类型", example = "database", required = true)
  private String sourceType;

  @Schema(description = "数据库连接配置")
  private Object database;

  @Schema(description = "API连接配置")
  private Object api;

  @Schema(description = "文件连接配置")
  private Object file;

  @Schema(description = "同步配置")
  private Object syncConfig;
}
