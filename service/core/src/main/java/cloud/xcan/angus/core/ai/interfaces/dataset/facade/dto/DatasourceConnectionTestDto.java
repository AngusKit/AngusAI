package cloud.xcan.angus.core.ai.interfaces.dataset.facade.dto;

import cloud.xcan.angus.core.ai.domain.dataset.DatabaseType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "测试数据源连接请求参数")
public class DatasourceConnectionTestDto {

  // 已保存数据源配置测试
  @Schema(description = "已保存数据集ID")
  private Long datasetId;

  // 未保存数据源配置测试
  @Schema(description = "数据源类型")
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
