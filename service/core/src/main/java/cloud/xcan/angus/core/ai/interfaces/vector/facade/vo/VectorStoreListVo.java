package cloud.xcan.angus.core.ai.interfaces.vector.facade.vo;

import cloud.xcan.angus.core.ai.infra.ai.vector.VectorStoreType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Data;

@Data
@Schema(description = "向量存储源列表项")
public class VectorStoreListVo {

  @Schema(description = "存储源ID")
  private Long id;

  @Schema(description = "名称")
  private String name;

  @Schema(description = "数据库类型")
  private VectorStoreType type;

  @Schema(description = "类型标签")
  private String typeLabel;

  @Schema(description = "类型图标")
  private String typeIcon;

  @Schema(description = "描述")
  private String description;

  @Schema(description = "连接地址")
  private String endpoint;

  @Schema(description = "状态")
  private String status;

  @Schema(description = "状态标签")
  private String statusLabel;

  @Schema(description = "状态颜色")
  private String statusColor;

  @Schema(description = "是否启用")
  private Boolean enabled;

  @Schema(description = "向量维度")
  private Integer dimension;

  @Schema(description = "索引数量")
  private Long indexCount;

  @Schema(description = "创建时间")
  private String createdTime;

  @Schema(description = "创建时间戳")
  private Long createdTimestamp;

  @Schema(description = "最后同步时间")
  private String lastSync;

  @Schema(description = "最后同步时间戳")
  private Long lastSyncTimestamp;

  @Schema(description = "配置信息（脱敏）")
  private Map<String, String> config;

  @Schema(description = "性能指标")
  private Map<String, Object> performance;
}

