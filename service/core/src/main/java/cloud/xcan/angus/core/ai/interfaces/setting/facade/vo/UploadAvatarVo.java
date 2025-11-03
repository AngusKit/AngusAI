package cloud.xcan.angus.core.ai.interfaces.setting.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 上传头像响应
 */
@Data
@Schema(description = "上传头像响应")
public class UploadAvatarVo {

  @Schema(description = "头像URL")
  private String avatarUrl;

  @Schema(description = "上传时间")
  private Long uploadedAt;
}
