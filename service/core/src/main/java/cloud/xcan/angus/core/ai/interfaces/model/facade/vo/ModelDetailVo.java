package cloud.xcan.angus.core.ai.interfaces.model.facade.vo;

import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelProvider;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Schema(description = "模型详情响应")
public class ModelDetailVo {

  @Schema(description = "模型ID")
  private Long id;

  @Schema(description = "模型名称")
  private String name;

  @Schema(description = "模型描述")
  private String description;

  @Schema(description = "模型类型")
  private ModelType type;

  @Schema(description = "模型图标")
  private String icon;

  @Schema(description = "图标背景色")
  private String iconBg;

  @Schema(description = "图标颜色")
  private String iconColor;

  @Schema(description = "模型提供商")
  private ModelProvider provider;

  @Schema(description = "版本号")
  private String version;

  @Schema(description = "模型状态")
  private ModelStatus status;

  @Schema(description = "状态颜色")
  private String statusColor;

  @Schema(description = "配置信息")
  private Object config;

  @Schema(description = "性能指标")
  private Object performance;

  @Schema(description = "资源使用")
  private Object resources;

  @Schema(description = "统计数据")
  private Object stats;

  @Schema(description = "部署时间")
  private String deployed;

  @Schema(description = "部署时间戳")
  private Long deployedAt;

  @Schema(description = "最后调用时间")
  private Long lastCallAt;

  @Schema(description = "创建时间")
  private LocalDateTime createdDate;

  @Schema(description = "最后修改时间")
  private LocalDateTime modifiedDate;
}
