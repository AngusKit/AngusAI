package cloud.xcan.angus.core.ai.interfaces.model.facade;

import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelTestDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateStatusDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelProvider;
import java.util.List;

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
  ModelDetailVo updateConfig(Long id, ModelConfigDefinition config);

  /**
   * 修改模型状态
   */
  ModelDetailVo updateStatus(Long id, ModelUpdateStatusDto dto);

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
   * 获取当前运行时支持的模型提供者列表（基于 ModelProvidersConfiguration 中已注册的 ModelFactory）
   */
  List<ModelProvider> getSupportedProviders();

  /**
   * 获取模型调用统计
   */
  ModelStatisticsVo getStatistics(SimpleStatisticsDto dto);

}
