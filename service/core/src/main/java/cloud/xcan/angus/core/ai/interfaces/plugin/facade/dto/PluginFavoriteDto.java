package cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "插件收藏请求参数")
public class PluginFavoriteDto {

  @NotNull(message = "收藏状态不能为空")
  @Schema(description = "是否收藏（true收藏，false取消收藏）", required = true)
  private Boolean isFavorite;
}
