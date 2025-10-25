package cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade;

import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocBatchDeleteDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocFindDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocSearchDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.dto.KnowledgeBaseDocToggleDto;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocListVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocSearchResultVo;
import cloud.xcan.angus.core.ai.interfaces.knowledgebase.facade.vo.KnowledgeBaseDocStatusVo;
import cloud.xcan.angus.remote.PageResult;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface KnowledgeBaseDocFacade {

  /**
   * 上传文档
   */
  List<KnowledgeBaseDocListVo> uploadDocuments(Long knowledgeBaseId, MultipartFile[] files);

  /**
   * 切换文档状态
   */
  KnowledgeBaseDocListVo toggleDocument(Long knowledgeBaseId, Long documentId,
      KnowledgeBaseDocToggleDto dto);

  /**
   * 重新处理文档
   */
  KnowledgeBaseDocStatusVo reprocessDocument(Long knowledgeBaseId, Long documentId);

  /**
   * 删除文档
   */
  void deleteDocument(Long knowledgeBaseId, Long documentId);

  /**
   * 批量删除文档
   */
  void batchDeleteDocuments(Long knowledgeBaseId, KnowledgeBaseDocBatchDeleteDto dto);

  /**
   * 获取文档列表
   */
  PageResult<KnowledgeBaseDocListVo> getDocumentList(Long knowledgeBaseId,
      KnowledgeBaseDocFindDto dto);

  /**
   * 搜索文档
   */
  List<KnowledgeBaseDocSearchResultVo> searchDocuments(Long knowledgeBaseId,
      KnowledgeBaseDocSearchDto dto);
}
