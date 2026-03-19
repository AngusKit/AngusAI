package cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatCostFromDollars;
import static cloud.xcan.angus.core.utils.PrincipalContextUtils.getOptTenantId;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.agentx.core.model.ModelConfigDefinition;
import cloud.xcan.angus.core.ai.application.query.model.ModelQuery.ModelDetailStats;
import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelPerformance;
import cloud.xcan.angus.core.ai.domain.model.ModelStats;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;
import org.apache.commons.lang3.StringUtils;

public class ModelAssembler {

  private static final String API_KEY_MASK = "**************";

  /**
   * 从 ModelDetailStats 构建 ModelPerformance（延迟、吞吐量、准确率）
   */
  private static ModelPerformance buildPerformance(ModelDetailStats detailStats) {
    if (detailStats == null) {
      return null;
    }
    boolean hasLatency = detailStats.avgResponseTimeMs() != null;
    boolean hasThroughput = detailStats.throughputMsgPerMin() != null;
    boolean hasAccuracy = detailStats.accuracyPercent() != null;
    if (!hasLatency && !hasThroughput && !hasAccuracy) {
      return null;
    }
    ModelPerformance perf = new ModelPerformance();
    if (hasLatency) {
      perf.setLatencyMs(detailStats.avgResponseTimeMs());
      double sec = detailStats.avgResponseTimeMs() / 1000.0;
      perf.setLatency(sec >= 1 ? String.format("%.2fs", sec)
          : (int) Math.round(detailStats.avgResponseTimeMs()) + "ms");
    }
    if (hasThroughput) {
      double tp = detailStats.throughputMsgPerMin();
      perf.setThroughputRaw(tp);
      perf.setThroughput(String.format("%.2f msg/min", tp));
    }
    if (hasAccuracy) {
      double acc = detailStats.accuracyPercent();
      perf.setAccuracyPercent(acc);
      perf.setAccuracy(String.format("%.1f%%", acc));
    }
    return perf;
  }

  /**
   * 对 config 中的 apiKey 进行脱敏，返回脱敏后的副本（避免修改原对象）
   */
  public static ModelConfigDefinition maskApiKey(ModelConfigDefinition config) {
    if (config == null) {
      return null;
    }
    if (StringUtils.isBlank(config.getApiKey())) {
      return config;
    }
    return ModelConfigDefinition.builder()
        .id(config.getId())
        .provider(config.getProvider())
        .type(config.getType())
        .modelName(config.getModelName())
        .apiKey(API_KEY_MASK)
        .baseUrl(config.getBaseUrl())
        .temperature(config.getTemperature())
        .maxTokens(config.getMaxTokens())
        .topP(config.getTopP())
        .frequencyPenalty(config.getFrequencyPenalty())
        .presencePenalty(config.getPresencePenalty())
        .timeoutSeconds(config.getTimeoutSeconds())
        .embeddingModelName(config.getEmbeddingModelName())
        .defaultConfig(config.isDefaultConfig())
        .priority(config.getPriority())
        .tenantId(config.getTenantId())
        .inputPricePerMillionTokens(config.getInputPricePerMillionTokens())
        .outputPricePerMillionTokens(config.getOutputPricePerMillionTokens())
        .extraProperties(config.getExtraProperties())
        .build();
  }

  public static Model toDomain(ModelCreateDto dto) {
    Model model = new Model();
    model.setName(dto.getName());
    model.setDescription(dto.getDescription());
    model.setType(dto.getType());
    model.setProvider(dto.getProvider());
    // 设置默认状态
    model.setStatus(ModelStatus.DISABLED);

    // 创建配置对象
    ModelConfigDefinition config = ModelConfigDefinition.builder()
        .modelName(dto.getName())
        .type(dto.getType())
        .provider(dto.getProvider())
        .baseUrl(dto.getBaseUrl())
        .apiKey(dto.getApiKey())
        .temperature(dto.getTemperature())
        .maxTokens(dto.getMaxTokens())
        .embeddingModelName(dto.getEmbeddingModelName())
        .defaultConfig(dto.isDefaultConfig())
        .priority(nullSafe(dto.getPriority(), 0))
        .tenantId(String.valueOf(getOptTenantId()))
        .inputPricePerMillionTokens(dto.getInputPricePerMillionTokens())
        .outputPricePerMillionTokens(dto.getOutputPricePerMillionTokens())
        .extraProperties(dto.getExtraProperties())
        .build();
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
    // 创建配置对象
    ModelConfigDefinition config = ModelConfigDefinition.builder()
        .modelName(dto.getName())
        .type(dto.getType())
        .provider(dto.getProvider())
        .baseUrl(dto.getBaseUrl())
        .apiKey(dto.getApiKey())
        .temperature(dto.getTemperature())
        .maxTokens(dto.getMaxTokens())
        .embeddingModelName(dto.getEmbeddingModelName())
        .defaultConfig(dto.isDefaultConfig())
        .priority(nullSafe(dto.getPriority(), 0))
        .tenantId(String.valueOf(getOptTenantId()))
        .inputPricePerMillionTokens(dto.getInputPricePerMillionTokens())
        .outputPricePerMillionTokens(dto.getOutputPricePerMillionTokens())
        .extraProperties(dto.getExtraProperties())
        .build();
    model.setConfig(config);
    return model;
  }

  public static ModelDetailVo toDetailVo(Model model) {
    return toDetailVo(model, null);
  }

  /**
   * 转换为详情 VO，支持通过 detailStats 填充 stats、performance（与列表接口计算逻辑一致）
   */
  public static ModelDetailVo toDetailVo(Model model, ModelDetailStats detailStats) {
    ModelDetailVo vo = new ModelDetailVo();
    vo.setId(model.getId());
    vo.setName(model.getName());
    vo.setDescription(model.getDescription());
    vo.setType(model.getType());
    vo.setProvider(model.getProvider());
    vo.setStatus(model.getStatus());

    // 设置模型配置（apiKey 脱敏）
    vo.setConfig(maskApiKey(model.getConfig()));
    // 设置访问限制
    vo.setAccessLimit(model.getAccessLimit());

    // 设置性能指标、统计数据：优先用 detailStats（从 ChatUsageLog 计算），否则用 model 自带的
    if (detailStats != null) {
      ModelStats stats = new ModelStats();
      stats.setTotalCalls(detailStats.totalCalls());
      stats.setTotalTokens(detailStats.totalTokens());
      stats.setTotalCost(detailStats.totalCost());
      stats.setTotalCostDisplay(detailStats.totalCostDisplay());
      vo.setStats(stats);

      ModelPerformance perf = buildPerformance(detailStats);
      if (perf != null) {
        vo.setPerformance(perf);
      }
    } else {
      vo.setPerformance(model.getPerformance());
      ModelStats stats = model.getStats();
      if (stats != null && stats.getTotalCost() != null) {
        stats.setTotalCostDisplay(formatCostFromDollars(stats.getTotalCost()));
      }
      if (stats != null && stats.getLastMonthGrowthTrend() != null
          && stats.getLastMonthGrowthTrend().getAddedCost() != null) {
        stats.getLastMonthGrowthTrend()
            .setAddedCostDisplay(
                formatCostFromDollars(stats.getLastMonthGrowthTrend().getAddedCost()));
      }
      if (stats != null && stats.getTodayGrowthTrend() != null
          && stats.getTodayGrowthTrend().getAddedCost() != null) {
        stats.getTodayGrowthTrend()
            .setAddedCostDisplay(formatCostFromDollars(stats.getTodayGrowthTrend().getAddedCost()));
      }
      vo.setStats(stats);
    }

    // 设置审计信息
    vo.setTenantId(model.getTenantId());
    vo.setCreatedBy(model.getCreatedBy());
    vo.setCreatedDate(model.getCreatedDate());
    vo.setModifiedBy(model.getModifiedBy());
    vo.setModifiedDate(model.getModifiedDate());
    return vo;
  }

  public static ModelListVo toListVo(Model model) {
    return toListVo(model, null);
  }

  /**
   * 转换为列表 VO，支持填充 stats、performance、maxTokens（用于卡片展示）
   */
  public static ModelListVo toListVo(Model model, ModelDetailStats detailStats) {
    ModelListVo vo = new ModelListVo();
    vo.setId(model.getId());
    vo.setName(model.getName());
    vo.setDescription(model.getDescription());
    vo.setType(model.getType());
    vo.setProvider(model.getProvider());
    vo.setStatus(model.getStatus());

    // 设置审计信息
    vo.setTenantId(model.getTenantId());
    vo.setCreatedBy(model.getCreatedBy());
    vo.setCreatedDate(model.getCreatedDate());
    vo.setModifiedBy(model.getModifiedBy());
    vo.setModifiedDate(model.getModifiedDate());

    // 填充 stats、performance、maxTokens（用于列表卡片展示）
    if (detailStats != null) {
      ModelStats stats = new ModelStats();
      stats.setTotalCalls(detailStats.totalCalls());
      stats.setTotalTokens(detailStats.totalTokens());
      stats.setTotalCost(detailStats.totalCost());
      stats.setTotalCostDisplay(detailStats.totalCostDisplay());
      vo.setStats(stats);

      ModelPerformance perf = buildPerformance(detailStats);
      if (perf != null) {
        vo.setPerformance(perf);
      }
    }

    if (model.getConfig() != null && model.getConfig().getMaxTokens() != null) {
      vo.setMaxTokens(model.getConfig().getMaxTokens());
    }

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
