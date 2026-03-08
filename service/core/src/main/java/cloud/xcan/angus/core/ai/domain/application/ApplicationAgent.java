package cloud.xcan.angus.core.ai.domain.application;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "application_id", nullable = false)
  private AIApplication application;

  @Column(name = "agent_id", nullable = false)
  private Long agentId;

  /** 是否为默认智能体（用于对话时选用） */
  @Column(name = "is_default", nullable = false)
  private Boolean isDefault = false;

  /** 排序号，越小越靠前 */
  @Column(name = "sort_order", nullable = false)
  private Integer sortOrder = 0;
}
