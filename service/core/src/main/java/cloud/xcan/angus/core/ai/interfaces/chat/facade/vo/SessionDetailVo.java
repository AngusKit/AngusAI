package cloud.xcan.angus.core.ai.interfaces.chat.facade.vo;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Date;
import lombok.Data;

/**
 * 会话详情VO
 */
@Data
@Schema(description = "会话详情视图")
public class SessionDetailVo {

  @Schema(description = "会话ID")
  private Long id;

  @Schema(description = "会话标题")
  private String title;

  @Schema(description = "关联的应用ID")
  private Long appId;

  @Schema(description = "应用名称")
  private String appName;

  @Schema(description = "使用的模型ID")
  private Long modelId;

  @Schema(description = "模型名称")
  private String modelName;

  @Schema(description = "会话配置")
  private SessionConfig config;

  @Schema(description = "消息总数")
  private Integer messageCount;

  @Schema(description = "是否收藏")
  private Boolean isStarred;

  @Schema(description = "创建时间")
  private Date createdDate;

  @Schema(description = "最后修改时间")
  private Date modifiedDate;

  @Schema(description = "创建人ID")
  private Long createdBy;

  @Schema(description = "创建人姓名")
  private String createdByName;
}
