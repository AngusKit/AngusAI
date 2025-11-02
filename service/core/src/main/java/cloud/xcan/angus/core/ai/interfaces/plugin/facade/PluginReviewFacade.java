package cloud.xcan.angus.core.ai.interfaces.plugin.facade;

import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginReviewCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginReviewVo;
import java.util.List;

public interface PluginReviewFacade {

  PluginReviewVo create(Long pluginId, PluginReviewCreateDto dto);

  List<PluginReviewVo> list(Long pluginId);
}
