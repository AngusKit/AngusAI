package cloud.xcan.angus.core.ai.interfaces.model.facade;

import cloud.xcan.angus.core.ai.domain.model.ModelConfig;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelTestDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelMetricsVo;
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
   * 批量操作模型
   */
  ModelStatisticsVo batchOperation(ModelStatisticsVo dto);

  /**
   * 导入模型配置
   */
  ModelStatisticsVo importConfig(ModelStatisticsVo dto);

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
   * 获取可用模型提供商
   */
  ModelStatisticsVo getProviders();

  /**
   * 导出模型配置
   */
  ModelDetailVo export(Long id);

  /**
   * 获取模型性能监控
   */
  ModelMetricsVo getMetrics(Long id, String period, Long startTime, Long endTime, String[] metrics);

  /**
   * 获取模型调用统计
   */
  ModelStatisticsVo getStatistics(Long id, String period, String groupBy);

  /**
   * 获取模型列表统计
   */
  ModelStatisticsVo getListStatistics();

}
