package cloud.xcan.angus.core.ai.interfaces.dataset.facade.vo;

import cloud.xcan.angus.core.ai.domain.dataset.DatabaseType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "数据源详情响应")
public class DatasourceConfigVo {

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
}
