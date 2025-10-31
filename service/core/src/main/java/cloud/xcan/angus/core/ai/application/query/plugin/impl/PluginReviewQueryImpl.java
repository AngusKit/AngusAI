package cloud.xcan.angus.core.ai.application.query.plugin.impl;

import cloud.xcan.angus.core.ai.application.query.plugin.PluginQuery;
import cloud.xcan.angus.core.ai.application.query.plugin.PluginReviewQuery;
import cloud.xcan.angus.core.ai.domain.plugin.PluginReview;
import cloud.xcan.angus.core.ai.domain.plugin.PluginReviewRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PluginReviewQueryImpl implements PluginReviewQuery {

  @Resource
  private PluginReviewRepo pluginReviewRepo;

  @Resource
  private PluginQuery pluginQuery;

  @Override
  public List<PluginReview> listByPluginId(Long pluginId) {
    return new BizTemplate<List<PluginReview>>() {
      @Override
      protected void checkParams() {
        pluginQuery.findAndCheck(pluginId);
      }

      @Override
      protected List<PluginReview> process() {
        return pluginReviewRepo.findByPluginId(pluginId);
      }
    }.execute();
  }
}

