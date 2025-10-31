package cloud.xcan.angus.core.ai.interfaces.model.facade;

import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelTestDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.remote.PageResult;

public interface ModelFacade {

  /**
   * 创建模型
   */
  ModelDetailVo create(ModelCreateDto dto);

  /**
   * 更新模型基本信息
   */
  ModelDetailVo update(Long id, ModelUpdateDto dto);

  /**
   * 更新模型配置
   */
  ModelDetailVo updateConfig(Long id, ModelConfig config);

  /**
   * 启动模型
   */
  ModelDetailVo start(Long id);

  /**
   * 停止模型
   */
  ModelDetailVo stop(Long id, Boolean graceful);

  /**
   * 重启模型
   */
  ModelDetailVo restart(Long id);

  /**
   * 测试模型连接
   */
  ModelDetailVo test(Long id, ModelTestDto dto);

  /**
   * 删除模型
   */
  void delete(Long id);

  /**
   * 获取模型详情
   */
  ModelDetailVo getDetail(Long id);

  /**
   * 获取模型列表
   */
  PageResult<ModelListVo> list(ModelFindDto dto);

  /**
   * 获取模型调用统计
   */
  ModelStatisticsVo getStatistics(Long id, StatisticsPeriod period);

}
