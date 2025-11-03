package cloud.xcan.angus.core.ai.domain.team;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * 团队设置实体
 */
@Entity
@Table(name = "team_settings")
@Setter
@Getter
@Accessors(chain = true)
public class TeamSettings extends TenantAuditingEntity<TeamSettings, Long> {

  @Id
  private Long id;

  @Column(name = "team_avatar", length = 400)
  private String teamAvatar;

  @Column(name = "team_name", length = 50)
  private String teamName;

  @Column(name = "team_email", length = 100)
  private String teamEmail;

  @Column(name = "team_description", length = 200)
  private String teamDescription;

  @Enumerated(EnumType.STRING)
  @Column(name = "team_scale")
  private TeamScale teamScale;

  @Enumerated(EnumType.STRING)
  @Column(name = "industry")
  private Industry industry;

  @Override
  public Long identity() {
    return this.id;
  }
}
