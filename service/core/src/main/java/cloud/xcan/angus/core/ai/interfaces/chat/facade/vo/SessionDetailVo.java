package cloud.xcan.angus.core.ai.interfaces.chat.facade.vo;

import cloud.xcan.angus.core.ai.domain.chat.SessionConfig;
import cloud.xcan.angus.core.ai.interfaces.chat.facade.vo.SessionListVo.LastMessage;
import cloud.xcan.angus.remote.NameJoinField;
import cloud.xcan.angus.remote.vo.AuditingVo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 会话详情VO
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "会话详情视图")
public class SessionDetailVo extends AuditingVo {

  @Schema(description = "会话实体ID")
  private Long id;

  @Schema(description = "会话ID(UUID)，对话/消息 API 使用此标识")
  private String sessionId;

  @Schema(description = "会话标题")
  private String title;

  @Schema(description = "关联的应用ID")
  private Long appId;

  @Schema(description = "应用名称")
  @NameJoinField(id = "appId", repository = "aiApplicationRepo")
  private String appName;

  @Schema(description = "使用的智能体ID")
  private Long agentId;

  @Schema(description = "使用的智能体名称")
  @NameJoinField(id = "agentId", repository = "agentRepo")
  private String agentName;

  @Schema(description = "使用的模型ID")
  private Long modelId;

  @Schema(description = "模型名称")
  @NameJoinField(id = "modelId", repository = "modelRepo")
  private String modelName;

  @Schema(description = "消息总数")
  private Integer messageCount;

  @Schema(description = "是否收藏")
  private Boolean isStarred;

  @Schema(description = "是否归档")
  private Boolean isArchived;

  @Schema(description = "是否顶置藏")
  private Boolean isPinned;

  @Schema(description = "会话配置")
  private SessionConfig config;

  @Schema(description = "最后一条消息")
  private LastMessage lastMessage;

}
