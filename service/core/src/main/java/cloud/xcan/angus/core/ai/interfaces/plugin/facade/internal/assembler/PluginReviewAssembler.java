package cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.plugin.PluginReview;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginReviewCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginReviewVo;

public class PluginReviewAssembler {

  public static PluginReview toDomain(Long pluginId, PluginReviewCreateDto dto) {
    return new PluginReview()
        .setPluginId(pluginId)
        .setRating(dto.getRating())
        .setContent(dto.getContent());
  }

  public static PluginReviewVo toVo(PluginReview review) {
    PluginReviewVo vo = new PluginReviewVo();
    vo.setId(review.getId());
    vo.setPluginId(review.getPluginId());
    vo.setRating(review.getRating());
    vo.setContent(review.getContent());
    vo.setCreatedBy(review.getCreatedBy());
    vo.setCreatedDate(review.getCreatedDate());
    return vo;
  }
}
