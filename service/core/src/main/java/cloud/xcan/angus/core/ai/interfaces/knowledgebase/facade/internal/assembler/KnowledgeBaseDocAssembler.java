package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal.assembler;

import static cloud.xcan.angus.core.ai.infra.util.CommonUtils.formatFileSize;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDocSearchResult;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocListVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocSearchResultVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocStatusVo;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder;
import cloud.xcan.angus.remote.search.SearchCriteria;
import java.util.Set;

public class KnowledgeBaseDocAssembler {

  public static KnowledgeBaseDocListVo toDocumentListVo(KnowledgeBaseDoc document) {
    KnowledgeBaseDocListVo vo = new KnowledgeBaseDocListVo();
    vo.setId(document.getId());
    vo.setName(document.getName());
    vo.setType(document.getType());
    vo.setSize(formatFileSize(document.getSize()));
    vo.setStatus(document.getStatus());
    vo.setEnabled(document.getEnabled());
    vo.setChunks(document.getChunks());
    vo.setProcessingProgress(document.getProcessingProgress());
    vo.setErrorMessage(document.getErrorMessage());

    // 设置审计信息
    vo.setTenantId(document.getTenantId());
    vo.setCreatedBy(document.getCreatedBy());
    vo.setCreatedDate(document.getCreatedDate());
    vo.setModifiedBy(document.getModifiedBy());
    vo.setModifiedDate(document.getModifiedDate());
    return vo;
  }

  public static KnowledgeBaseDocStatusVo toDocumentStatusVo(KnowledgeBaseDoc document) {
    KnowledgeBaseDocStatusVo vo = new KnowledgeBaseDocStatusVo();
    vo.setId(document.getId());
    vo.setStatus(document.getStatus());
    vo.setProcessingProgress(document.getProcessingProgress());
    vo.setChunks(document.getChunks());
    vo.setErrorMessage(document.getErrorMessage());
    return vo;
  }

  public static KnowledgeBaseDocSearchResultVo toDocumentSearchResultVo(
      KnowledgeBaseDocSearchResult searchResult) {
    KnowledgeBaseDocSearchResultVo vo = new KnowledgeBaseDocSearchResultVo();
    // TODO
    return vo;
  }

  public static GenericSpecification<KnowledgeBaseDoc> getSpecification(
      KnowledgeBaseDocFindDto dto) {
    // Build the final filters
    Set<SearchCriteria> filters = new SearchCriteriaBuilder<>(dto)
        .rangeSearchFields("id", "createdDate")
        .orderByFields("id", "createdDate", "name", "size")
        .matchSearchFields("name")
        .inAndNotFields("type", "status", "enabled")
        .build();
    return new GenericSpecification<>(filters);
  }
}
