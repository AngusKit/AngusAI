package cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.plugin.PluginCmd;
import cloud.xcan.angus.core.ai.application.query.plugin.PluginQuery;
import cloud.xcan.angus.core.ai.domain.plugin.Plugin;
import cloud.xcan.angus.core.ai.domain.plugin.PluginConfig;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.PluginFacade;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginDuplicateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFavoriteDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFindDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginInstallDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.internal.assembler.PluginAssembler;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginDetailVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginListVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
  public PluginDetailVo duplicate(Long id, PluginDuplicateDto dto) {
    Plugin saved = pluginCmd.duplicate(id, dto.getName(), dto.getCopyConfig(), 
        dto.getCopyPermissions(), dto.getCopyTags());
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo update(Long id, PluginUpdateDto dto) {
    Plugin plugin = PluginAssembler.updateDomain(id, dto);
    Plugin saved = pluginCmd.update(plugin);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo updateConfig(Long id, PluginConfig config) {
    Plugin saved = pluginCmd.updateConfig(id, config);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo modifyStatus(Long id, PluginStatus status) {
    Plugin saved = pluginCmd.modifyStatus(id, status);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public void delete(Long id) {
    pluginCmd.delete(id);
  }

  @NameJoin
  @Override
  public PluginDetailVo getDetail(Long id) {
    Plugin plugin = pluginQuery.findById(id);
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
  public PluginDetailVo favorite(Long id, PluginFavoriteDto dto) {
    Plugin saved = pluginCmd.favorite(id, dto.getIsFavorite());
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginDetailVo install(Long id, PluginInstallDto dto) {
    // TODO: 处理安装配置
    Plugin saved = pluginCmd.install(id);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public void uninstall(Long id) {
    pluginCmd.uninstall(id);
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
  public PluginDetailVo verify(Long id, Boolean verified) {
    Plugin saved = pluginCmd.verify(id, verified);
    return PluginAssembler.toDetailVo(saved);
  }

  @Override
  public PluginStatisticsVo getStatistics(String period) {
    // TODO: 实现统计逻辑
    PluginStatisticsVo statistics = new PluginStatisticsVo();
    return statistics;
  }

  @NameJoin
  @Override
  public PageResult<PluginListVo> search(String keyword, PluginFindDto dto) {
    dto.setKeyword(keyword);
    return list(dto);
  }

  @NameJoin
  @Override
  public PageResult<PluginListVo> getTrendingPlugins(Integer limit) {
    PageRequest pageable = PageRequest.of(0, limit != null ? limit : 10);
    Page<Plugin> page = pluginQuery.findTrendingPlugins(pageable);
    return buildVoPageResult(page, PluginAssembler::toListVo);
  }
}
