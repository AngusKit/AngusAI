package cloud.xcan.angus.core.ai.domain.dataset;

import static java.util.Objects.nonNull;
import static org.apache.commons.lang3.ObjectUtils.isNotEmpty;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class DatasourceConfig {

  @Schema(description = "数据源名称")
  private String name;

  @Schema(description = "数据库类型")
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

  public boolean isValid() {
    return nonNull(databaseType) && (isNotEmpty(jdbcUrl)
        || ((isNotEmpty(database) && isNotEmpty(host) && isNotEmpty(port))));
  }
}
