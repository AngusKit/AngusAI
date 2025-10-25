package cloud.xcan.angus.core.ai.interfaces.chat.facade.dto;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 更新会话DTO
 */
@Data
@Schema(description = "更新会话请求")
public class SessionUpdateDto {

  @Schema(description = "会话标题")
  @Size(max = 200, message = "标题长度不能超过200字符")
  private String title;

  @Schema(description = "关联的应用ID")
  private Long appId;

  @Schema(description = "使用的模型ID")
  private Long modelId;

  @Schema(description = "会话配置")
  private SessionConfig config;

  @Schema(description = "是否置顶")
  private Boolean isPinned;

  @Schema(description = "是否收藏")
  private Boolean isStarred;

  @Schema(description = "是否归档")
  private Boolean isArchived;
}
