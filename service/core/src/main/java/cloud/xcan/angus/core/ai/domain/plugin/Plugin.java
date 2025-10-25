package cloud.xcan.angus.core.ai.domain.plugin;

import cloud.xcan.angus.core.jpa.multitenancy.TenantAuditingEntity;
import cloud.xcan.angus.core.jpa.multitenancy.TenantListener;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

/**
 * 插件实体
 */
@Entity
@Table(name = "plugin")
@EntityListeners({TenantListener.class})
@Setter
@Getter
@Accessors(chain = true)
public class Plugin extends TenantAuditingEntity<Plugin, Long> {

  @Id
  private Long id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "name_en", length = 100)
  private String nameEn;

  @Column(name = "icon")
  private String icon;

  @Column(name = "description", length = 500)
  private String description;

  @Column(name = "author", length = 100)
  private String author;

  @Column(name = "version", nullable = false, length = 20)
  private String version;

  @Enumerated(EnumType.STRING)
  @Column(name = "category", nullable = false)
  private PluginCategory category;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private PluginStatus status = PluginStatus.INACTIVE;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private PluginType type;

  // 插件详细配置（JSON格式存储）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "config")
  private PluginConfig config;

  // 权限配置（JSON格式存储）
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "permissions")
  private PluginPermissions permissions;

  // 标签
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "tags")
  private java.util.List<PluginTag> tags;

  // 统计数据
  @Column(name = "install_count")
  private Long installCount = 0L;

  @Column(name = "usage_count")
  private Long usageCount = 0L;

  @Column(name = "rating")
  private Double rating = 0.0;

  @Column(name = "review_count")
  private Long reviewCount = 0L;

  // 是否收藏（由用户级别控制，这里作为快捷标记）
  @Column(name = "is_favorite")
  private Boolean isFavorite = false;

  // 是否为系统插件
  @Column(name = "is_system")
  private Boolean isSystem = false;

  // 是否公开
  @Column(name = "is_public")
  private Boolean isPublic = false;

  // 是否经过验证
  @Column(name = "is_verified")
  private Boolean isVerified = false;

  // 最小系统版本要求
  @Column(name = "min_version", length = 20)
  private String minVersion;

  // 发布时间
  @Column(name = "published_date")
  private LocalDateTime publishedDate;

  // 主页URL
  @Column(name = "homepage_url", length = 500)
  private String homepageUrl;

  // 文档URL
  @Column(name = "documentation_url", length = 500)
  private String documentationUrl;

  // 源码仓库URL
  @Column(name = "repository_url", length = 500)
  private String repositoryUrl;

  // 支持URL
  @Column(name = "support_url", length = 500)
  private String supportUrl;

  // 许可证
  @Column(name = "license", length = 50)
  private String license;

  // 价格（0表示免费）
  @Column(name = "price")
  private Double price = 0.0;

  // 货币单位
  @Column(name = "currency", length = 10)
  private String currency = "CNY";

  @Override
  public Long fetchId() {
    return id;
  }
}
