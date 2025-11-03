package cloud.xcan.angus.core.ai.domain.plugin;

import lombok.Getter;

/**
 * Simple projection for grouped counts: key + total
 */
@Getter
public class CategoryCountView {

  private final PluginCategory key;
  private final long total;

  public CategoryCountView(PluginCategory key, long total) {
    this.key = key;
    this.total = total;
  }
}
