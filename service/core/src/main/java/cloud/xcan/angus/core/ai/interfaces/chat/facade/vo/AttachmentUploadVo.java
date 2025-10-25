package cloud.xcan.angus.core.ai.interfaces.chat.facade.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 附件上传响应VO
 */
@Data
@Schema(description = "附件上传响应")
public class AttachmentUploadVo {

  @Schema(description = "附件ID")
  private Long id;

  @Schema(description = "文件名")
  private String name;

  @Schema(description = "MIME类型")
  private String type;

  @Schema(description = "文件大小")
  private Long size;

  @Schema(description = "访问URL")
  private String url;

  @Schema(description = "上传时间")
  private Long uploadedAt;
}
