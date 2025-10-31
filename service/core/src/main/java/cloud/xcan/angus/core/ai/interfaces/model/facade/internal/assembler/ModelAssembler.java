package cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelStats;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.infra.ai.model.ModelConfig;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelStatisticsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class ModelAssembler {

  public static Model toDomain(ModelCreateDto dto) {
    Model model = new Model();
    model.setName(dto.getName());
    model.setDescription(dto.getDescription());
    model.setType(dto.getType());
    model.setProvider(dto.getProvider());
    model.setVersion(dto.getVersion());

    // 设置默认状态
    model.setStatus(ModelStatus.STOPPED);

    // 创建配置对象
    ModelConfig config = new ModelConfig();
    config.setModelName(dto.getName());
    config.setModelType(dto.getType());
    config.setProvider(dto.getProvider());
    config.setVersion(dto.getVersion());
    config.setDescription(dto.getDescription());
    config.setApiEndpoint(dto.getApiEndpoint());
    config.setApiKey(dto.getApiKey());
    config.setTemperature(dto.getTemperature());
    config.setMaxTokens(dto.getMaxTokens());
    model.setConfig(config);
    return model;
  }

  public static Model updateDomain(Long id, ModelUpdateDto dto) {
    Model model = new Model();
    model.setId(id);
    model.setName(dto.getName());
    model.setDescription(dto.getDescription());
    model.setType(dto.getType());
    model.setProvider(dto.getProvider());
    model.setVersion(dto.getVersion());

    // 创建配置对象
    ModelConfig config = new ModelConfig();
    config.setModelName(dto.getName());
    config.setModelType(dto.getType());
    config.setProvider(dto.getProvider());
    config.setVersion(dto.getVersion());
    config.setDescription(dto.getDescription());
    config.setApiEndpoint(dto.getApiEndpoint());
    config.setApiKey(dto.getApiKey());
    config.setTemperature(dto.getTemperature());
    config.setMaxTokens(dto.getMaxTokens());
    model.setConfig(config);
    return model;
  }

  public static ModelDetailVo toDetailVo(Model model) {
    ModelDetailVo vo = new ModelDetailVo();
    vo.setId(model.getId());
    vo.setName(model.getName());
    vo.setDescription(model.getDescription());
    vo.setType(model.getType());
    vo.setProvider(model.getProvider());
    vo.setVersion(model.getVersion());
    vo.setStatus(model.getStatus());

    // 设置模型配置
    vo.setConfig(model.getConfig());
    // 设置访问限制
    vo.setAccessLimit(model.getAccessLimit());

    // 设置性能指标
    vo.setPerformance(model.getPerformance());
    // 设置统计数据
    vo.setStats(model.getStats());

    // 设置审计信息
    vo.setTenantId(model.getTenantId());
    vo.setCreatedBy(model.getCreatedBy());
    vo.setCreatedDate(model.getCreatedDate());
    vo.setModifiedBy(model.getModifiedBy());
    vo.setModifiedDate(model.getModifiedDate());
    return vo;
  }

  public static ModelListVo toListVo(Model model) {
    ModelListVo vo = new ModelListVo();
    vo.setId(model.getId());
    vo.setName(model.getName());
    vo.setDescription(model.getDescription());
    vo.setType(model.getType());
    vo.setProvider(model.getProvider());
    vo.setVersion(model.getVersion());
    vo.setStatus(model.getStatus());

    // 设置审计信息
    vo.setTenantId(model.getTenantId());
    vo.setCreatedBy(model.getCreatedBy());
    vo.setCreatedDate(model.getCreatedDate());
    vo.setModifiedBy(model.getModifiedBy());
    vo.setModifiedDate(model.getModifiedDate());
    return vo;
  }

  public static ModelStatisticsVo ToStatistics(ModelStats stats) {
    ModelStatisticsVo vo = new ModelStatisticsVo();
    vo.setTotalModels(stats.getTotalModels());
    vo.setRunningModels(stats.getRunningModels());
    vo.setTotalCalls(stats.getTotalCalls());
    vo.setFailedCalls(stats.getFailedCalls());
    vo.setTotalCost(stats.getTotalCost());
    vo.setSuccessRate(stats.getSuccessRate());
    vo.setTotalTokensConsumed(stats.getTotalTokensConsumed());
    vo.setAverageLatencyMs(stats.getAverageLatencyMs());

    vo.setTodayGrowthTrend(stats.getTodayGrowthTrend());
    vo.setLastMonthGrowthTrend(stats.getLastMonthGrowthTrend());
    return vo;
  }

  public static GenericSpecification<Model> getSpecification(ModelFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "createdDate", "modifiedDate", "name", "provider", "type", "status")
        .matchSearchFields("name", "description")
        .inAndNotFields("provider", "type", "status")
        .build();
    return new GenericSpecification<>(filters);
  }

}
