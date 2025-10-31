package cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal;

import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginReviewCmd;
import cloud.xcan.angus.core.ai.application.query.plugin.PluginReviewQuery;
import cloud.xcan.angus.core.ai.domain.plugin.PluginReview;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.PluginReviewFacade;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginReviewCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal.assembler.PluginReviewAssembler;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginReviewVo;
import cloud.xcan.angus.core.biz.NameJoin;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class PluginReviewFacadeImpl implements PluginReviewFacade {

  @Resource
  private PluginReviewQuery pluginReviewQuery;

  @Resource
  private PluginReviewCmd pluginReviewCmd;

  @NameJoin
  @Override
  public PluginReviewVo create(Long pluginId, PluginReviewCreateDto dto) {
    PluginReview review = PluginReviewAssembler.toDomain(pluginId, dto);
    PluginReview saved = pluginReviewCmd.create(review);
    return PluginReviewAssembler.toVo(saved);
  }

  @NameJoin
  @Override
  public List<PluginReviewVo> list(Long pluginId) {
    return pluginReviewQuery.listByPluginId(pluginId).stream()
        .map(PluginReviewAssembler::toVo)
        .collect(Collectors.toList());
  }
}
