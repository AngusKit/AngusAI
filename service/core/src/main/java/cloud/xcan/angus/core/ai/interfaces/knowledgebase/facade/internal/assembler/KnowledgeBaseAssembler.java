package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatFileSize;
import static cloud.xcan.angus.spec.utils.ObjectUtils.nullSafe;

import cloud.xcan.angus.core.ai.domain.Visibility;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBase;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseCreateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseUpdateDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDetailVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseListVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseStatsVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class KnowledgeBaseAssembler {

  public static KnowledgeBase toCreateDomain(KnowledgeBaseCreateDto dto) {
    KnowledgeBase knowledgeBase = new KnowledgeBase();
    knowledgeBase.setName(dto.getName());
    knowledgeBase.setIcon(dto.getIcon());
    knowledgeBase.setIconBg(dto.getIconBg());
    knowledgeBase.setDescription(dto.getDescription());
    knowledgeBase.setVisibility(nullSafe(dto.getVisibility(), Visibility.PRIVATE));
    knowledgeBase.setTags(dto.getTags());

    // 设置默认值
    knowledgeBase.setEnabled(true);
    knowledgeBase.setDocumentsCount(0);
    knowledgeBase.setTotalSize(0L);
    knowledgeBase.setTotalChunks(0);

    // 设置向量化配置
    knowledgeBase.setConfig(dto.getConfig());
    return knowledgeBase;
  }

  public static KnowledgeBase toUpdateDomain(Long id, KnowledgeBaseUpdateDto dto) {
    KnowledgeBase knowledgeBase = new KnowledgeBase();
    knowledgeBase.setId(id);
    knowledgeBase.setName(dto.getName());
    knowledgeBase.setIcon(dto.getIcon());
    knowledgeBase.setIconBg(dto.getIconBg());
    knowledgeBase.setDescription(dto.getDescription());
    knowledgeBase.setVisibility(dto.getVisibility());
    knowledgeBase.setTags(dto.getTags());

    // 设置向量化配置
    knowledgeBase.setConfig(dto.getConfig());
    return knowledgeBase;
  }

  public static KnowledgeBaseDetailVo toDetailVo(KnowledgeBase knowledgeBase) {
    KnowledgeBaseDetailVo vo = new KnowledgeBaseDetailVo();
    vo.setId(knowledgeBase.getId());
    vo.setName(knowledgeBase.getName());
    vo.setIcon(knowledgeBase.getIcon());
    vo.setIconBg(knowledgeBase.getIconBg());
    vo.setDescription(knowledgeBase.getDescription());
    vo.setEnabled(knowledgeBase.getEnabled());
    vo.setTags(knowledgeBase.getTags());
    vo.setVisibility(knowledgeBase.getVisibility());

    // 设置审计信息
    vo.setTenantId(knowledgeBase.getTenantId());
    vo.setCreatedBy(knowledgeBase.getCreatedBy());
    vo.setCreatedDate(knowledgeBase.getCreatedDate());
    vo.setModifiedBy(knowledgeBase.getModifiedBy());
    vo.setModifiedDate(knowledgeBase.getModifiedDate());

    // 设置统计信息
    KnowledgeBaseStatsVo stats = new KnowledgeBaseStatsVo();
    stats.setTotalDocuments(knowledgeBase.getDocumentsCount());
    stats.setActiveDocuments(knowledgeBase.getActiveDocuments());
    stats.setTotalChunks(knowledgeBase.getTotalChunks());
    stats.setAvgChunkSize(knowledgeBase.getTotalChunks() > 0
        ? knowledgeBase.getConfig().getChunkSize() : 0);
    stats.setTotalSize(formatFileSize(knowledgeBase.getTotalSize()));
    vo.setStats(stats);

    // 设置配置信息
    vo.setConfig(knowledgeBase.getConfig());
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
    vo.setModifiedBy(knowledgeBase.getModifiedBy());
    vo.setModifiedDate(knowledgeBase.getModifiedDate());
    return vo;
  }

  public static GenericSpecification<KnowledgeBase> getSpecification(KnowledgeBaseFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate", "modifiedDate")
        .orderByFields("id", "createdDate",
            "modifiedDate", "documentsCount", "totalSize", "name")
        .matchSearchFields("name", "description")
        .inAndNotFields("visibility", "enabled")
        .build();
    return new GenericSpecification<>(filters);
  }
}
