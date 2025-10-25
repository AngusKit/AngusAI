package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatFileSize;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.domain.knowledgebase.DocumentVisibility;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseConfig;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseConfigDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseCreateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseConfigVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDetailVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseListVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseStatsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class KnowledgeBaseAssembler {

  public static KnowledgeBase toDomain(KnowledgeBaseCreateDto dto) {
    KnowledgeBase knowledgeBase = new KnowledgeBase();
    knowledgeBase.setName(dto.getName());
    knowledgeBase.setIcon(dto.getIcon());
    knowledgeBase.setIconBg(dto.getIconBg());
    knowledgeBase.setDescription(dto.getDescription());
    knowledgeBase.setVisibility(nullSafe(dto.getVisibility(), DocumentVisibility.PRIVATE));
    knowledgeBase.setTags(dto.getTags());
    knowledgeBase.setConfig(toConfig(dto.getConfig()));

    // 设置默认值
    knowledgeBase.setEnabled(true);
    knowledgeBase.setDocumentsCount(0);
    knowledgeBase.setTotalSize(0L);
    knowledgeBase.setTotalChunks(0);
    return knowledgeBase;
  }

  public static KnowledgeBase updateDomain(Long id, KnowledgeBaseUpdateDto dto) {
    KnowledgeBase knowledgeBase = new KnowledgeBase();
    knowledgeBase.setId(id);
    knowledgeBase.setName(dto.getName());
    knowledgeBase.setIcon(dto.getIcon());
    knowledgeBase.setIconBg(dto.getIconBg());
    knowledgeBase.setDescription(dto.getDescription());
    knowledgeBase.setVisibility(dto.getVisibility());
    knowledgeBase.setTags(dto.getTags());
    knowledgeBase.setConfig(toConfig(dto.getConfig()));
    return knowledgeBase;
  }

  private static KnowledgeBaseConfig toConfig(KnowledgeBaseConfigDto dto) {
    if (dto == null) {
      return null;
    }
    KnowledgeBaseConfig config = new KnowledgeBaseConfig();
    config.setChunkSize(dto.getChunkSize());
    config.setChunkOverlap(dto.getChunkOverlap());
    config.setEmbeddingModel(dto.getEmbeddingModel());
    return config;
  }

  public static KnowledgeBaseDetailVo toDetailVo(KnowledgeBase knowledgeBase) {
    KnowledgeBaseDetailVo vo = new KnowledgeBaseDetailVo();
    vo.setId(knowledgeBase.getId());
    vo.setName(knowledgeBase.getName());
    vo.setIcon(knowledgeBase.getIcon());
    vo.setIconBg(knowledgeBase.getIconBg());
    vo.setDescription(knowledgeBase.getDescription());
    vo.setDocumentsCount(knowledgeBase.getDocumentsCount());
    vo.setTotalSize(formatFileSize(knowledgeBase.getTotalSize()));
    vo.setEnabled(knowledgeBase.getEnabled());
    vo.setTags(knowledgeBase.getTags());
    vo.setVisibility(knowledgeBase.getVisibility());

    // 设置审计信息
    vo.setTenantId(knowledgeBase.getTenantId());
    vo.setCreatedBy(knowledgeBase.getCreatedBy());
    vo.setCreatedDate(knowledgeBase.getCreatedDate());
    vo.setLastModifiedBy(knowledgeBase.getLastModifiedBy());
    vo.setLastModifiedDate(knowledgeBase.getLastModifiedDate());

    // 设置统计信息
    KnowledgeBaseStatsVo stats = new KnowledgeBaseStatsVo();
    stats.setTotalDocuments(knowledgeBase.getDocumentsCount());
    stats.setActiveDocuments(knowledgeBase.getDocumentsCount()); // TODO: 计算已启用文档数
    stats.setTotalChunks(knowledgeBase.getTotalChunks());
    stats.setAvgChunkSize(knowledgeBase.getTotalChunks() > 0 ? 512 : 0); // TODO: 计算平均分段大小
    vo.setStats(stats);

    // 设置配置信息
    if (knowledgeBase.getConfig() != null) {
      KnowledgeBaseConfigVo config = new KnowledgeBaseConfigVo();
      config.setChunkSize(knowledgeBase.getConfig().getChunkSize());
      config.setChunkOverlap(knowledgeBase.getConfig().getChunkOverlap());
      config.setEmbeddingModel(knowledgeBase.getConfig().getEmbeddingModel());
      vo.setConfig(config);
    }
    return vo;
  }

  public static KnowledgeBaseListVo toListVo(KnowledgeBase knowledgeBase) {
    KnowledgeBaseListVo vo = new KnowledgeBaseListVo();
    vo.setId(knowledgeBase.getId());
    vo.setName(knowledgeBase.getName());
    vo.setIcon(knowledgeBase.getIcon());
    vo.setIconBg(knowledgeBase.getIconBg());
    vo.setDescription(knowledgeBase.getDescription());
    vo.setDocumentsCount(knowledgeBase.getDocumentsCount());
    vo.setTotalSize(formatFileSize(knowledgeBase.getTotalSize()));
    vo.setEnabled(knowledgeBase.getEnabled());
    vo.setTags(knowledgeBase.getTags());
    vo.setVisibility(knowledgeBase.getVisibility());

    // 设置审计信息
    vo.setTenantId(knowledgeBase.getTenantId());
    vo.setCreatedBy(knowledgeBase.getCreatedBy());
    vo.setCreatedDate(knowledgeBase.getCreatedDate());
    vo.setLastModifiedBy(knowledgeBase.getLastModifiedBy());
    vo.setLastModifiedDate(knowledgeBase.getLastModifiedDate());
    return vo;
  }

  public static GenericSpecification<KnowledgeBase> getSpecification(KnowledgeBaseFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "lastModifiedDate")
        .orderByFields("id", "createdDate", "lastModifiedDate", "name")
        .matchSearchFields("name", "description")
        .inAndNotFields("visibility", "enabled")
        .build();
    return new GenericSpecification<>(filters);
  }
}
