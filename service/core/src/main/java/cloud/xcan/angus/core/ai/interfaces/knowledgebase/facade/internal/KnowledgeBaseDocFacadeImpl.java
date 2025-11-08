package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal;

import static cloud.xcan.angus.core.jpa.criteria.SearchCriteriaBuilder.getMatchSearchFields;
import static cloud.xcan.angus.core.utils.CoreUtils.buildVoPageResult;

import cloud.xcan.angus.core.ai.application.cmd.knowledgebase.KnowledgeBaseDocCmd;
import cloud.xcan.angus.core.ai.application.query.knowledgebase.KnowledgeBaseDocQuery;
import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.KnowledgeBaseDocFacade;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocBatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocSearchDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocToggleDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocUploadDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.internal.assembler.KnowledgeBaseDocAssembler;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocSearchResultVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocStatusVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocVo;
import cloud.xcan.angus.core.biz.NameJoin;
import cloud.xcan.angus.core.jpa.criteria.GenericSpecification;
import cloud.xcan.angus.remote.PageResult;
import cloud.xcan.angus.remote.search.SearchCriteria;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class KnowledgeBaseDocFacadeImpl implements KnowledgeBaseDocFacade {

  @Resource
  private KnowledgeBaseDocCmd documentCmd;

  @Resource
  private KnowledgeBaseDocQuery documentQuery;

  @NameJoin
  @Override
  public KnowledgeBaseDocVo uploadDocument(Long knowledgeBaseId, KnowledgeBaseDocUploadDto dto) {
    KnowledgeBaseDoc doc = documentCmd.uploadDocument(knowledgeBaseId, dto.getFile());
    return KnowledgeBaseDocAssembler.toDocumentListVo(doc);
  }

  @NameJoin
  @Override
  public KnowledgeBaseDocStatusVo reprocessDocument(Long knowledgeBaseId, Long documentId) {
    KnowledgeBaseDoc document = documentCmd.reprocessDocument(knowledgeBaseId, documentId);
    return KnowledgeBaseDocAssembler.toDocumentStatusVo(document);
  }

  @NameJoin
  @Override
  public KnowledgeBaseDocStatusVo toggleDocument(Long knowledgeBaseId, Long documentId,
      KnowledgeBaseDocToggleDto dto) {
    KnowledgeBaseDoc document = documentCmd.toggleDocument(knowledgeBaseId, documentId,
        dto.getEnabled());
    return KnowledgeBaseDocAssembler.toDocumentStatusVo(document);
  }

  @Override
  public void deleteDocument(Long knowledgeBaseId, Long documentId) {
    documentCmd.deleteDocument(knowledgeBaseId, documentId);
  }

  @Override
  public void batchDeleteDocuments(Long knowledgeBaseId, KnowledgeBaseDocBatchDeleteDto dto) {
    documentCmd.batchDeleteDocuments(knowledgeBaseId, dto.getDocumentIds());
  }

  @NameJoin
  @Override
  public PageResult<KnowledgeBaseDocVo> getDocumentList(Long knowledgeBaseId,
      KnowledgeBaseDocFindDto dto) {
    GenericSpecification<KnowledgeBaseDoc> spec = KnowledgeBaseDocAssembler.getSpecification(dto);
    spec.getCriteria().add(SearchCriteria.equal("knowledgeBaseId", knowledgeBaseId));
    Page<KnowledgeBaseDoc> page = documentQuery.find(spec, dto.tranPage(),
        dto.fullTextSearch, getMatchSearchFields(dto.getClass()));
    return buildVoPageResult(page, KnowledgeBaseDocAssembler::toDocumentListVo);
  }

  @Override
  public List<KnowledgeBaseDocSearchResultVo> searchDocuments(Long knowledgeBaseId,
      KnowledgeBaseDocSearchDto dto) {
    return documentQuery.searchDocuments(knowledgeBaseId, dto.getKeyword(), dto.getLimit(),
            dto.getThreshold()).stream().map(KnowledgeBaseDocAssembler::toDocumentSearchResultVo)
        .collect(Collectors.toList());
  }
}
