package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import static cloud.xcan.angus.core.ai.domain.Constants.DATASOURCE_DATABASE_MAX_LENGTH;
import static cloud.xcan.angus.core.ai.domain.Constants.DATASOURCE_HOST_MAX_LENGTH;
import static cloud.xcan.angus.core.ai.domain.Constants.DATASOURCE_JDBC_URL_MAX_LENGTH;
import static cloud.xcan.angus.core.ai.domain.Constants.DATASOURCE_NAME_MAX_LENGTH;
import static cloud.xcan.angus.core.ai.domain.Constants.DATASOURCE_PASSWORD_MAX_LENGTH;
import static cloud.xcan.angus.core.ai.domain.Constants.DATASOURCE_USERNAME_MAX_LENGTH;

import cloud.xcan.angus.core.ai.domain.dataset.DatabaseType;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Schema(description = "添加数据源请求参数")
public class DataSourceUpdateDto {

  @NotBlank(message = "数据源名称不能为空")
  @Length(max = DATASOURCE_NAME_MAX_LENGTH)
  @Schema(description = "数据源名称", example = "MySQL数据库", requiredMode = RequiredMode.REQUIRED)
  private String name;

  @NotNull(message = "数据源类型不能为空")
  @Schema(description = "数据源类型", example = "database", requiredMode = RequiredMode.REQUIRED)
  private DatabaseType databaseType;

  @Length(max = DATASOURCE_DATABASE_MAX_LENGTH)
  @Schema(description = "数据库")
  private String database;

  @Length(max = DATASOURCE_JDBC_URL_MAX_LENGTH)
  @Schema(description = "数据库Jdbc URL")
  private String jdbcUrl;

  @Length(max = DATASOURCE_HOST_MAX_LENGTH)
  @Schema(description = "数据库主机名或IP")
  private String host;

  @Schema(description = "数据库端口")
  private Integer port;

  @Length(max = DATASOURCE_USERNAME_MAX_LENGTH)
  @Schema(description = "数据库用户名")
  private String username;

  @Length(max = DATASOURCE_PASSWORD_MAX_LENGTH)
  @Schema(description = "数据库密码")
  private String password;
}
