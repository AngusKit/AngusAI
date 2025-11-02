package cloud.xcan.angus.core.ai.application.cmd.plugin.impl;

import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginCmd;
import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginReviewCmd;
import cloud.xcan.angus.core.ai.application.query.plugin.PluginQuery;
import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginReview;
import cloud.xcan.angus.core.ai.domain.plugin.PluginReviewRepo;
import cloud.xcan.angus.core.biz.BizTemplate;
import cloud.xcan.angus.core.biz.cmd.CommCmd;
import cloud.xcan.angus.core.jpa.repository.BaseRepository;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PluginReviewCmdImpl extends CommCmd<PluginReview, Long> implements PluginReviewCmd {

  @Resource
  private PluginReviewRepo pluginReviewRepo;

  @Resource
  private PluginQuery pluginQuery;

  @Resource
  private PluginCmd pluginCmd;

  @Override
  @Transactional
  public PluginReview create(PluginReview review) {
    return new BizTemplate<PluginReview>() {
      Plugin pluginDb;
      @Override
      protected void checkParams() {
        // Ensure plugin exists
        pluginDb = pluginQuery.findAndCheck(review.getPluginId());
      }

      @Override
      protected PluginReview process() {
        insert0(review);

        // After save, update aggregates
        Double avg = pluginReviewRepo.findAverageRatingByPluginId(review.getPluginId());
        Long cnt = pluginReviewRepo.countByPluginId(review.getPluginId());

        pluginDb.setRating(avg == null ? 0.0 : avg);
        pluginDb.setReviewCount(cnt == null ? 0L : cnt);
        pluginCmd.update0(pluginDb);
        return review;
      }
    }.execute();
  }

  @Override
  public void deleteByPluginId(Long id) {
    pluginReviewRepo.deleteByPluginId(id);
  }

  @Override
  protected BaseRepository<PluginReview, Long> getRepository() {
    return pluginReviewRepo;
  }
}

