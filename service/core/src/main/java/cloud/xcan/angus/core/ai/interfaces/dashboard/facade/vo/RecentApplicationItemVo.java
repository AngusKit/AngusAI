package cloud.xcan.angus.core.ai.interfaces.dashboard.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

@Data
@Schema(description = "最近应用列表项")
public class RecentApplicationItemVo {

  @Schema(description = "应用 ID")
  private String id;

  @Schema(description = "应用图标")
  private String icon;

  @Schema(description = "应用名称")
  private String name;

  @Schema(description = "简短描述")
  private String description;

  @Schema(description = "完整描述")
  private String fullDescription;

  @Schema(description = "标签列表")
  private List<String> tags;

  @Schema(description = "使用说明（如 已 1.2K 次调用）")
  private String usage;

  @Schema(description = "创建时间")
  private String createdAt;

  @Schema(description = "最后使用时间（相对或绝对）")
  private String lastUsed;

  @Schema(description = "总调用次数展示")
  private String totalCalls;

  @Schema(description = "平均响应时间展示")
  private String avgResponseTime;
}
