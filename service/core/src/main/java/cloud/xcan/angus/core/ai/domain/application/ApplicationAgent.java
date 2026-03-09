package cloud.xcan.angus.core.ai.domain.application;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 应用-智能体绑定关系（一对多）
 * 一个应用可绑定多个智能体，通过 isDefault 标识默认用于对话的智能体
 */
@Entity
@Table(name = "ai_application_agent")
@Setter
@Getter
@Accessors(chain = true)
public class ApplicationAgent {

  @Id
  private Long id;

  @Column(name = "application_id", nullable = false)
  private Long applicationId;

  @Column(name = "agent_id", nullable = false)
  private Long agentId;

  /** 是否为默认智能体（用于对话时选用） */
  @Column(name = "is_default", nullable = false)
  private Boolean isDefault = false;

  /** 排序号，越小越靠前 */
  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder = 0;
}
