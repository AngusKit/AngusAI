package cloud.xcan.angus.core.ai.interfaces.model.facade.internal;

import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.model.ModelCmd;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;
import cloud.xcan.angus.core.ai.interfaces.model.facade.ModelFacade;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelTestDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler.ModelAssembler;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelMetricsVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

@Component
public class ModelFacadeImpl implements ModelFacade {

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private ModelCmd modelCmd;

  @Override
  public ModelDetailVo create(ModelCreateDto dto) {
    Model model = ModelAssembler.toDomain(dto);
    Model saved = modelCmd.create(model);
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public ModelDetailVo update(Long id, ModelUpdateDto dto) {
    Model model = ModelAssembler.updateDomain(id, dto);
    Model saved = modelCmd.update(model);
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public ModelDetailVo updateConfig(Long id, ModelConfig config) {
    Model saved = modelCmd.updateConfig(id, config);
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public ModelDetailVo start(Long id) {
    Model saved = modelCmd.start(id);
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public ModelDetailVo stop(Long id, Boolean graceful) {
    Model saved = modelCmd.stop(id, graceful);
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public ModelDetailVo restart(Long id) {
    Model saved = modelCmd.restart(id);
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public ModelDetailVo test(Long id, ModelTestDto dto) {
    Model saved = modelCmd.test(id, dto.getTestPrompt());
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public ModelStatisticsVo batchOperation(ModelStatisticsVo dto) {
    // 这里应该调用批量操作服务
    // 暂时返回模拟数据
    ModelStatisticsVo result = new ModelStatisticsVo();
    // TODO: 实现批量操作逻辑
    return result;
  }

  @Override
  public ModelStatisticsVo importConfig(ModelStatisticsVo dto) {
    // 这里应该调用导入服务
    // 暂时返回模拟数据
    ModelStatisticsVo result = new ModelStatisticsVo();
    // TODO: 实现导入逻辑
    return result;
  }

  @Override
  public void delete(Long id) {
    modelCmd.delete(id);
  }

  @NameJoin
  @Override
  public ModelDetailVo getDetail(Long id) {
    Model model = modelQuery.findAndCheck(id);
    return ModelAssembler.toDetailVo(model);
  }

  @NameJoin
  @Override
  public PageResult<ModelListVo> list(ModelFindDto dto) {
    GenericSpecification<Model> spec = ModelAssembler.getSpecification(dto);
    Page<Model> page = modelQuery.find(spec,
        PageRequest.of(0, 20),
        false,
        null);
    return buildVoPageResult(page, ModelAssembler::toListVo);
  }

  @Override
  public ModelStatisticsVo getProviders() {
    // 这里应该调用提供商服务获取详细数据
    // 暂时返回模拟数据
    ModelStatisticsVo providers = new ModelStatisticsVo();
    // TODO: 实现提供商逻辑
    return providers;
  }

  @Override
  public ModelDetailVo export(Long id) {
    Model model = modelQuery.findAndCheck(id);
    return ModelAssembler.toDetailVo(model);
  }

  @Override
  public ModelMetricsVo getMetrics(Long id, String period, Long startTime, Long endTime, String[] metrics) {
    // 这里应该调用监控服务获取详细数据
    // 暂时返回模拟数据
    ModelMetricsVo metricsVo = new ModelMetricsVo();
    // TODO: 实现监控逻辑
    return metricsVo;
  }

  @Override
  public ModelStatisticsVo getStatistics(Long id, String period, String groupBy) {
    // 这里应该调用统计服务获取详细数据
    // 暂时返回模拟数据
    ModelStatisticsVo statistics = new ModelStatisticsVo();
    // TODO: 实现统计逻辑
    return statistics;
  }

  @Override
  public ModelStatisticsVo getListStatistics() {
    // 这里应该调用统计服务获取详细数据
    // 暂时返回模拟数据
    ModelStatisticsVo statistics = new ModelStatisticsVo();
    // TODO: 实现列表统计逻辑
    return statistics;
  }
}
