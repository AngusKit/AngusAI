package cloud.xcan.angus.core.ai.interfaces.model.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.agentx.core.model.ModelFactory;
import cloud.xcan.agentx.core.model.ModelProvider;
import cloud.xcan.angus.api.commonlink.FullResourceType;
import cloud.xcan.angus.core.ai.application.cmd.activity.ActivityCmd;
import cloud.xcan.angus.core.ai.application.cmd.model.ModelCmd;
import cloud.xcan.angus.core.ai.domain.activity.ActivityActions;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.interfaces.model.facade.ModelFacade;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelTestDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateStatusDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler.ModelAssembler;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.dto.SimpleStatisticsDto;
import jakarta.annotation.Resource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class ModelFacadeImpl implements ModelFacade {

  @Resource
  private ModelQuery modelQuery;

  @Resource
  private ModelCmd modelCmd;

  @Resource
  private List<ModelFactory> modelFactories;

  @Resource
  private ActivityCmd activityCmd;

  @NameJoin
  @Override
  public ModelDetailVo create(ModelCreateDto dto) {
    Model model = ModelAssembler.toDomain(dto);
    Model saved = modelCmd.create(model);
    activityCmd.recordActivity(FullResourceType.MODEL, saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_MODEL_CREATED);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo update(Long id, ModelUpdateDto dto) {
    Model model = ModelAssembler.updateDomain(id, dto);
    Model saved = modelCmd.update(model);
    activityCmd.recordActivity(FullResourceType.MODEL, saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_MODEL_UPDATED);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo updateConfig(Long id, ModelConfigDefinition config) {
    Model saved = modelCmd.updateConfig(id, config);
    activityCmd.recordActivity(FullResourceType.MODEL, saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_MODEL_CONFIG_UPDATED);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo updateStatus(Long id, ModelUpdateStatusDto dto) {
    Model saved = modelCmd.updateStatus(id, dto.getStatus());
    activityCmd.recordActivity(FullResourceType.MODEL, saved.getId(), saved.getName(),
        ActivityActions.ACTIVITY_MODEL_STATUS_UPDATED);
    return ModelAssembler.toDetailVo(saved);
  }

  @NameJoin
  @Override
  public ModelDetailVo test(Long id, ModelTestDto dto) {
    Model saved = modelCmd.test(id, dto.getTestPrompt());
    return ModelAssembler.toDetailVo(saved);
  }

  @Override
  public void delete(Long id) {
    Model existing = modelQuery.findAndCheck(id);
    modelCmd.delete(id);
    activityCmd.recordActivity(FullResourceType.MODEL, id, existing.getName(),
        ActivityActions.ACTIVITY_MODEL_DELETED);
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

    // 批量获取今日统计，填充列表卡片展示字段，避免前端 N+1 调用 detail 接口
    LocalDate today = LocalDate.now();
    LocalDateTime todayStart = today.atStartOfDay();
    LocalDateTime todayEnd = today.plusDays(1).atStartOfDay();
    List<Long> modelIds = page.getContent().stream()
        .map(Model::getId)
        .filter(id -> id != null)
        .toList();
    Map<Long, ModelQuery.ModelDetailStats> statsMap = modelQuery.getDetailStatsForModelIds(
        modelIds, todayStart, todayEnd);

    return buildVoPageResult(page, model -> {
      ModelQuery.ModelDetailStats stats = model.getId() != null ? statsMap.get(model.getId()) : null;
      return ModelAssembler.toListVo(model, stats);
    });
  }

  @Override
  public List<ModelProvider> getSupportedProviders() {
    if (modelFactories == null || modelFactories.isEmpty()) {
      return List.of();
    }
    return modelFactories.stream()
        .map(ModelFactory::getProvider)
        .distinct()
        .sorted()
        .collect(Collectors.toList());
  }

  /**
   * 获取模型统计信息
   *
   * @param dto 统计参数
   * @return 统计信息VO
   */
  @Override
  public ModelStatisticsVo getStatistics(SimpleStatisticsDto dto) {
    return modelQuery.getStatistics(dto);
  }
}
