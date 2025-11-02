package cloud.xcan.angus.core.ai.domain.plugin;

import lombok.Getter;

/**
 * Simple projection for sum results: total
 */
@Getter
public class LongTotalView {

  private final Long total;

  public LongTotalView(Long total) {
    this.total = total;
  }
}
