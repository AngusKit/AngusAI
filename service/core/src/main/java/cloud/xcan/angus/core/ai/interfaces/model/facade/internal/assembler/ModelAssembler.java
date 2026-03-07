package cloud.xcan.angus.core.ai.interfaces.model.facade.internal.assembler;

import static cloud.xcan.angus.core.utils.PrincipalContextUtils.getOptTenantId;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.domain.model.Model;
import cloud.xcan.angus.core.ai.domain.model.ModelStatus;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelCreateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelFindDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.dto.ModelUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelDetailVo;
import cloud.xcan.angus.core.ai.interfaces.model.facade.vo.ModelListVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import cloud.xcan.core.model.ModelConfigDefinition;
import java.util.Set;

public class ModelAssembler {

  public static Model toDomain(ModelCreateDto dto) {
    Model model = new Model();
    model.setName(dto.getName());
    model.setDescription(dto.getDescription());
    model.setType(dto.getType());
    model.setProvider(dto.getProvider());
    // 设置默认状态
    model.setStatus(ModelStatus.STOPPED);

    // 创建配置对象
    ModelConfigDefinition config = new ModelConfigDefinition();
    config.setModelName(dto.getName());
    config.setType(dto.getType());
    config.setProvider(dto.getProvider());
    config.setBaseUrl(dto.getApiEndpoint());
    config.setApiKey(dto.getApiKey());
    config.setTemperature(dto.getTemperature());
    config.setMaxTokens(dto.getMaxTokens());
    config.setEmbeddingModelName(dto.getEmbeddingModelName());
    config.setDefaultConfig(dto.isDefaultConfig());
    config.setPriority(nullSafe(dto.getPriority(), 0));
    config.setTenantId(String.valueOf(getOptTenantId()));
    config.setExtraProperties(dto.getExtraProperties());
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
    ModelConfigDefinition config = new ModelConfigDefinition();
    config.setModelName(dto.getName());
    config.setType(dto.getType());
    config.setProvider(dto.getProvider());
    config.setBaseUrl(dto.getApiEndpoint());
    config.setApiKey(dto.getApiKey());
    config.setTemperature(dto.getTemperature());
    config.setMaxTokens(dto.getMaxTokens());
    config.setEmbeddingModelName(dto.getEmbeddingModelName());
    config.setDefaultConfig(dto.isDefaultConfig());
    config.setPriority(nullSafe(dto.getPriority(), 0));
    config.setTenantId(String.valueOf(getOptTenantId()));
    config.setExtraProperties(dto.getExtraProperties());
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
    vo.setStatus(model.getStatus());

    // 设置审计信息
    vo.setTenantId(model.getTenantId());
    vo.setCreatedBy(model.getCreatedBy());
    vo.setCreatedDate(model.getCreatedDate());
    vo.setModifiedBy(model.getModifiedBy());
    vo.setModifiedDate(model.getModifiedDate());
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
