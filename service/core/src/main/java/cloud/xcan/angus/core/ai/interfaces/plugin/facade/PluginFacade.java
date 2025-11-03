package cloud.xcan.angus.core.ai.interfaces.plugin.facade;

import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.plugin.PluginStatus;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginCreateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginFindDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.dto.PluginVerifyDto;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginDetailVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginListVo;
import cloud.xcan.angus.core.ai.interfaces.plugin.facade.vo.PluginStatisticsVo;
import cloud.xcan.angus.remote.PageResult;

public interface PluginFacade {

  /**
   * 创建插件
   */
  PluginDetailVo create(PluginCreateDto dto);

  /**
   * 更新插件基本信息
   */
  PluginDetailVo update(Long id, PluginUpdateDto dto);

  /**
   * 修改插件状态
   */
  PluginDetailVo modifyStatus(Long id, PluginStatus status);

  /**
   * 安装插件
   */
  PluginDetailVo install(Long id);

  /**
   * 卸载插件
   */
  PluginDetailVo uninstall(Long id);

  /**
   * 使用插件（增加使用次数）
   */
  PluginDetailVo use(Long id);

  /**
   * 发布插件
   */
  PluginDetailVo publish(Long id);

  /**
   * 验证插件
   */
  PluginDetailVo verify(PluginVerifyDto dto);

  /**
   * 删除插件
   */
  void delete(Long id);

  /**
   * 获取插件详情
   */
  PluginDetailVo getDetail(Long id);

  /**
   * 获取插件列表
   */
  PageResult<PluginListVo> list(PluginFindDto dto);

  /**
   * 获取插件统计
   */
  PluginStatisticsVo getStatistics(StatisticsPeriod period);
}
