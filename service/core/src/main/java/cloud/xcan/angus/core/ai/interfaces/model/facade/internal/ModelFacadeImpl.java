package cloud.xcan.angus.core.ai.interfaces.model.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.model.ModelCmd;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.StatisticsPeriod;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelStats;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;
import cloud.xcan.angus.core.ai.interfaces.model.facade.ModelFacade;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelTestDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler.ModelAssembler;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
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
    Page<Model> page = modelQuery.find(spec, dto.tranPage(), dto.fullTextSearch,
        getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, ModelAssembler::toListVo);
  }

  @Override
  public ModelStatisticsVo getStatistics(Long id, StatisticsPeriod period) {
    ModelStats stats = modelQuery.getStatistics(id, period);
    return ModelAssembler.ToStatistics(stats);
  }

}
