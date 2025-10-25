package cloud.xcan.angus.core.ai.domain.plugin;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import lombok.Data;

/**
 * 插件标签
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PluginTag implements Serializable {

  /**
   * 标签文本
   */
  private String label;

  /**
   * 标签颜色
   */
  private String color;

  public PluginTag() {
  }

  public PluginTag(String label, String color) {
    this.label = label;
    this.color = color;
  }
}
