package cloud.xcan.angus.core.ai.domain.dataset;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import org.hibernate.annotations.Type;

/**
 * 数据集配置
 */
@Data
@Embeddable
public class DatasetConfig {

  // 文本数据配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "text_config")
  private Object textConfig;

  // 表格数据配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "table_config")
  private Object tableConfig;

  // 数据源配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "data_source_config")
  private Object dataSourceConfig;

  // 数据处理配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "processing")
  private Object processing;

  // 同步配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "sync_config")
  private Object syncConfig;

  // 安全配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "security")
  private Object security;

  // 监控配置
  @Type(JsonType.class)
  @Column(columnDefinition = "json", name = "monitoring")
  private Object monitoring;
}
