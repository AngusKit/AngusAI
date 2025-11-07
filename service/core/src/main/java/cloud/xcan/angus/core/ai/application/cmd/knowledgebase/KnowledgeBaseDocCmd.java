package cloud.xcan.angus.core.ai.application.cmd.knowledgebase;

import cloud.xcan.angus.core.ai.domain.knowledgebase.KnowledgeBaseDoc;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface KnowledgeBaseDocCmd {

  /**
   * 上传文档
   */
  KnowledgeBaseDoc uploadDocument(Long knowledgeBaseId, MultipartFile file);

  /**
   * 切换文档状态
   */
  KnowledgeBaseDoc toggleDocument(Long knowledgeBaseId, Long documentId, Boolean enabled);

  /**
   * 重新处理文档
   */
  KnowledgeBaseDoc reprocessDocument(Long knowledgeBaseId, Long documentId);

  /**
   * 删除文档
   */
  void deleteDocument(Long knowledgeBaseId, Long documentId);

  /**
   * 批量删除文档
   */
  void batchDeleteDocuments(Long knowledgeBaseId, List<Long> documentIds);

}
