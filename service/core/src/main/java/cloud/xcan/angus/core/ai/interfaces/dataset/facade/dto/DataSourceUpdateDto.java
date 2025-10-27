package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import cloud.xcan.angus.core.ai.domain.dataset.DatabaseType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "添加数据源请求参数")
public class DataSourceUpdateDto {

  @NotBlank(message = "数据源名称不能为空")
  @Length(max = 50)
  @Schema(description = "数据源名称", example = "MySQL数据库", required = true)
  private String name;

  @NotNull(message = "数据源类型不能为空")
  @Schema(description = "数据源类型", example = "database", required = true)
  private DatabaseType databaseType;

  @Schema(description = "数据库")
  private String database;

  @Schema(description = "数据库Jdbc URL")
  private String jdbcUrl;

  @Schema(description = "数据库主机名或IP")
  private String host;

  @Schema(description = "数据库端口")
  private Integer port;

  @Schema(description = "数据库用户名")
  private String username;

  @Schema(description = "数据库密码")
  private String password;
}
