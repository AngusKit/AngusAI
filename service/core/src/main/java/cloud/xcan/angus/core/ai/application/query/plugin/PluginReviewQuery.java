package cloud.xcan.angus.core.ai.application.query.plugin;

import cloud.xcan.angus.core.ai.domain.plugin.PluginReview;
import java.util.List;

public interface PluginReviewQuery {

  List<PluginReview> listByPluginId(Long pluginId);
}
