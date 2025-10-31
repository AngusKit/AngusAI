package cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginCmd;
import cloud.xcan.angus.core.ai.application.query.plugin.PluginQuery;
import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatistics;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.domain.plugin.StatisticsPeriod;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.PluginFacade;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFavoriteDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFindDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginVerifyDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal.assembler.PluginAssembler;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginDetailVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginListVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class PluginFacadeImpl implements PluginFacade {

  @Resource
  private PluginQuery pluginQuery;

  @Resource
  private PluginCmd pluginCmd;

  @Override
  public PluginDetailVo create(PluginCreateDto dto) {
    Plugin plugin = PluginAssembler.toDomain(dto);
    Plugin saved = pluginCmd.create(plugin);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo update(Long id, PluginUpdateDto dto) {
    Plugin plugin = PluginAssembler.updateDomain(id, dto);
    Plugin saved = pluginCmd.update(plugin);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo modifyStatus(Long id, PluginStatus status) {
    Plugin saved = pluginCmd.modifyStatus(id, status);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo install(Long id) {
    Plugin saved = pluginCmd.install(id);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo uninstall(Long id) {
    Plugin saved = pluginCmd.uninstall(id);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo use(Long id) {
    Plugin saved = pluginCmd.use(id);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo publish(Long id) {
    Plugin saved = pluginCmd.publish(id);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo verify(PluginVerifyDto dto) {
    Plugin saved = pluginCmd.verify(dto.getName(), dto.getVersion(),
        dto.getCategory(), dto.getType(), dto.getFile());
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public void delete(Long id) {
    pluginCmd.delete(id);
  }

  @NameJoin
  @Override
  public PluginDetailVo getDetail(Long id) {
    Plugin plugin = pluginQuery.findAndCheck(id);
    return PluginAssembler.toDetailVo(plugin);
  }

  @NameJoin
  @Override
  public PageResult<PluginListVo> list(PluginFindDto dto) {
    GenericSpecification<Plugin> spec = PluginAssembler.getSpecification(dto);
    Page<Plugin> page = pluginQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, PluginAssembler::toListVo);
  }

  @Override
  public PluginStatisticsVo getStatistics(StatisticsPeriod period) {
    PluginStatistics statistics = pluginQuery.getStatistics(period);
    return PluginAssembler.toStatisticsVo(statistics);
  }
}
